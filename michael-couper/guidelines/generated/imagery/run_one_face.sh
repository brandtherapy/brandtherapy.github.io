#!/usr/bin/env bash
set -uo pipefail
ROOT="/Users/florian/Projects/FP"
cd "$ROOT"
set -a
source "$HOME/.claude/skills/fp-image-gen/.env"
set +a

NAME="$1"
ASPECT="$2"
OUTFIT="$3"
MAX="${4:-4}"
MODEL="${FP_GEMINI_IMAGE_MODEL:-gemini-3-pro-image-preview}"

IMG_DIR="working-folder/michael-couper-brand-therapy-guidelines-2026-07-23/generated/imagery"
PROMPTS="$IMG_DIR/prompts"
RUNS="$IMG_DIR/_runs"
FINAL="$IMG_DIR/${NAME}.jpg"
FACE="brand-os/brands/michael-couper/images/likeness/michael-couper-v1-no-glasses.png"
case "$OUTFIT" in
  carbon) REF="brand-os/brands/michael-couper/images/likeness/michael-couper-outfit-carbon.png" ;;
  polo)   REF="brand-os/brands/michael-couper/images/likeness/michael-couper-outfit-polo.png" ;;
  tuxedo) REF="brand-os/brands/michael-couper/images/likeness/michael-couper-outfit-tuxedo.png" ;;
  *) echo "bad outfit $OUTFIT"; exit 2 ;;
esac

mkdir -p "$RUNS" "$IMG_DIR/_scores"
SCORE_FILE="$IMG_DIR/_scores/${NAME}.json"

attempt=1
while [[ $attempt -le $MAX ]]; do
  echo "=== $NAME attempt $attempt / $MAX (aspect $ASPECT, outfit $OUTFIT, model $MODEL) ==="
  OUT_JSON=""
  set +e
  OUT_JSON=$(python3 tools/likeness/generate_gemini_candidate.py \
    --candidate "$NAME" \
    --prompt-file "$PROMPTS/${NAME}.txt" \
    --input "$FACE" \
    --input "$REF" \
    --output-root "$RUNS" \
    --aspect-ratio "$ASPECT" \
    --image-size "2K" \
    --temperature 0.18 \
    --model "$MODEL" 2>"$IMG_DIR/_scores/${NAME}.gen-a${attempt}.err")
  GEN_EC=$?
  set -e
  if [[ $GEN_EC -ne 0 ]]; then
    echo "Generation error ec=$GEN_EC — retrying immediately"
    cat "$IMG_DIR/_scores/${NAME}.gen-a${attempt}.err" | tail -20
    sleep 3
    attempt=$((attempt+1))
    continue
  fi
  echo "$OUT_JSON"
  SRC=$(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); print(d["saved_images"][0] if d.get("saved_images") else "")' "$OUT_JSON")
  if [[ -z "$SRC" || ! -f "$SRC" ]]; then
    echo "No image saved on attempt $attempt"
    attempt=$((attempt+1))
    continue
  fi
  python3 -c "from PIL import Image; im=Image.open('$SRC').convert('RGB'); im.save('$FINAL','JPEG',quality=92,optimize=True); print('wrote','$FINAL',im.size)"
  GATE_LOG="$IMG_DIR/_scores/${NAME}.gate-a${attempt}.txt"
  set +e
  tools/likeness/face-gate --brand michael-couper --candidate "$FINAL" >"$GATE_LOG" 2>&1
  GATE_EC=$?
  set -e
  cat "$GATE_LOG"
  python3 - "$SCORE_FILE" "$NAME" "$attempt" "$GATE_EC" "$SRC" "$FINAL" "$GATE_LOG" <<'PY'
import json, re, sys
from pathlib import Path
score_file, name, attempt, ec, src, final, gate_log = sys.argv[1:]
text = Path(gate_log).read_text()
m = re.search(r'"score"\s*:\s*([0-9.]+)', text) or re.search(r'score[=:\s]+([0-9]\.[0-9]+)', text, re.I) or re.search(r'\b(0\.\d+)\b', text)
score = float(m.group(1)) if m else None
Path(score_file).write_text(json.dumps({
    "name": name,
    "attempt": int(attempt),
    "exit_code": int(ec),
    "score": score,
    "gate_output": text,
    "source": src,
    "final": final,
}, indent=2) + "\n")
print(f"recorded score={score} exit={ec}")
PY
  if [[ $GATE_EC -eq 0 ]]; then
    echo "PASS $NAME"
    exit 0
  fi
  echo "FAIL/REVIEW $NAME ec=$GATE_EC — regenerating"
  attempt=$((attempt+1))
done
echo "BLOCKED: $NAME failed after $MAX attempts"
exit 4
