#!/usr/bin/env bash
# Flexible single-face runner: NAME ASPECT FACE_REF OUTFIT_REF [MAX]
# Saves candidate to faces/<NAME>.jpg, face-gates it, records score JSON.
set -uo pipefail
ROOT="/Users/florian/Projects/FP"
cd "$ROOT"
set -a
source "$HOME/.claude/skills/fp-image-gen/.env"
set +a

NAME="$1"
ASPECT="$2"
FACE="$3"
REF="$4"
MAX="${5:-3}"
MODEL="${FP_GEMINI_IMAGE_MODEL:-gemini-3-pro-image-preview}"

IMG_DIR="working-folder/michael-couper-brand-therapy-guidelines-2026-07-23/generated/imagery"
PROMPTS="$IMG_DIR/prompts"
RUNS="$IMG_DIR/_runs"
FACES="$IMG_DIR/faces"
FINAL="$FACES/${NAME}.jpg"

mkdir -p "$RUNS" "$FACES" "$IMG_DIR/_scores"
SCORE_FILE="$IMG_DIR/_scores/${NAME}.json"

attempt=1
while [[ $attempt -le $MAX ]]; do
  echo "=== $NAME attempt $attempt / $MAX (aspect $ASPECT, model $MODEL) ==="
  echo "    face=$FACE"
  echo "    ref =$REF"
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
    echo "Generation error ec=$GEN_EC — retrying with backoff"
    tail -5 "$IMG_DIR/_scores/${NAME}.gen-a${attempt}.err"
    sleep $((attempt*5))
    attempt=$((attempt+1))
    continue
  fi
  SRC=$(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); print(d["saved_images"][0] if d.get("saved_images") else "")' "$OUT_JSON")
  if [[ -z "$SRC" || ! -f "$SRC" ]]; then
    echo "No image saved on attempt $attempt (model returned text only) — retrying"
    sleep 3
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
m = re.search(r'match\s*=\s*([0-9.]+)', text) or re.search(r'"hero_sim"\s*:\s*([0-9.]+)', text)
score = float(m.group(1)) if m else None
ec = int(ec)
verdict = "PASS" if ec==0 else ("REVIEW" if ec==1 else "FAIL")
Path(score_file).write_text(json.dumps({
    "name": name, "attempt": int(attempt), "exit_code": ec,
    "verdict": verdict, "score": score, "source": src, "final": final,
}, indent=2) + "\n")
print(f"recorded score={score} verdict={verdict} exit={ec}")
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
