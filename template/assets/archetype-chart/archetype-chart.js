const COMPONENT_NAME = "bt-archetype-chart";
const SVG_NS = "http://www.w3.org/2000/svg";

const styles = `
  :host {
    --bt-chart-ink: #101117;
    --bt-chart-muted: #62646f;
    --bt-chart-line: #cfd1d9;
    --bt-chart-paper: #fbfaf8;
    --bt-chart-accent: #5b5cf6;
    --bt-chart-accent-soft: color-mix(in srgb, var(--bt-chart-accent) 18%, transparent);
    --bt-chart-focus: var(--bt-chart-accent);
    --bt-chart-radius: 1.25rem;
    color: var(--bt-chart-ink);
    display: block;
    font-family: inherit;
  }

  * { box-sizing: border-box; }
  button { color: inherit; font: inherit; }

  .frame {
    background: var(--bt-chart-paper);
    border: 1px solid color-mix(in srgb, var(--bt-chart-ink) 12%, transparent);
    border-radius: var(--bt-chart-radius);
    margin: 0;
    overflow: hidden;
    padding: clamp(1rem, 2.5vw, 2rem);
  }

  :host([theme="reveal"]) {
    --bt-chart-ink: #efede7;
    --bt-chart-muted: #aaa7a0;
    --bt-chart-line: rgba(239, 237, 231, .2);
    --bt-chart-paper: #070709;
    --bt-chart-accent: #c9c5ba;
    --bt-chart-accent-soft: rgba(201, 197, 186, .18);
    --bt-chart-focus: #efede7;
    --bt-chart-radius: 0;
  }

  :host([theme="reveal"]) .frame {
    background: transparent;
    border: 0;
    padding: 0;
  }

  .visual {
    aspect-ratio: 1;
    margin-inline: auto;
    max-width: 46rem;
    min-width: 18rem;
    position: relative;
  }

  .radar {
    height: 66%;
    inset: 17%;
    overflow: visible;
    position: absolute;
    width: 66%;
  }

  .grid-line {
    fill: none;
    stroke: var(--bt-chart-line);
    stroke-width: 1.4;
    vector-effect: non-scaling-stroke;
  }

  .axis-line {
    stroke: color-mix(in srgb, var(--bt-chart-line) 74%, transparent);
    stroke-width: 1;
    transition: opacity 220ms cubic-bezier(.16, 1, .3, 1), stroke 220ms cubic-bezier(.16, 1, .3, 1);
    vector-effect: non-scaling-stroke;
  }

  .axis-line.is-active {
    opacity: 1;
    stroke: var(--bt-chart-accent);
    stroke-width: 2;
  }

  .profile {
    fill: var(--bt-chart-accent-soft);
    stroke: var(--bt-chart-accent);
    stroke-linejoin: round;
    stroke-width: 3;
    transform-box: fill-box;
    transform-origin: center;
    vector-effect: non-scaling-stroke;
  }

  :host([animate]) .profile {
    animation: chart-enter 700ms cubic-bezier(.16, 1, .3, 1) both;
  }

  @keyframes chart-enter {
    from { opacity: 0; transform: scale(.35); }
    to { opacity: 1; transform: scale(1); }
  }

  .core {
    fill: var(--bt-chart-ink);
  }

  :host([theme="reveal"]) .core {
    fill: var(--bt-chart-paper);
    stroke: var(--bt-chart-accent);
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }

  :host([theme="reveal"]) .visual { max-width: 38rem; }

  .profile-node {
    fill: var(--bt-chart-paper);
    opacity: .72;
    stroke: var(--bt-chart-accent);
    stroke-width: 2;
    transform-box: fill-box;
    transform-origin: center;
    transition: opacity 220ms cubic-bezier(.16, 1, .3, 1), transform 220ms cubic-bezier(.16, 1, .3, 1);
    vector-effect: non-scaling-stroke;
  }

  .profile-node.is-active {
    opacity: 1;
    transform: scale(1.8);
  }

  .portrait {
    align-items: center;
    aspect-ratio: 1;
    background: #ececf0;
    border: 2px solid var(--bt-chart-paper);
    border-radius: 50%;
    box-shadow: 0 7px 20px rgb(16 17 23 / .12);
    cursor: pointer;
    display: flex;
    justify-content: center;
    left: var(--x);
    margin: 0;
    max-width: 7rem;
    overflow: visible;
    padding: 0;
    position: absolute;
    top: var(--y);
    transform: translate(-50%, -50%);
    transition: border-color 220ms cubic-bezier(.16, 1, .3, 1), box-shadow 220ms cubic-bezier(.16, 1, .3, 1), filter 220ms cubic-bezier(.16, 1, .3, 1), opacity 220ms cubic-bezier(.16, 1, .3, 1), transform 220ms cubic-bezier(.16, 1, .3, 1);
    width: 15%;
  }

  :host([theme="reveal"]) .portrait {
    background: #17171a;
    border-color: #070709;
    box-shadow: none;
  }

  .portrait:hover,
  .portrait:focus-visible,
  .portrait.is-active {
    border-color: var(--bt-chart-focus);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--bt-chart-focus) 24%, transparent);
    opacity: 1;
    outline: none;
    transform: translate(-50%, -50%) scale(1.08);
    z-index: 3;
  }

  :host([theme="reveal"]) .portrait:hover,
  :host([theme="reveal"]) .portrait:focus-visible,
  :host([theme="reveal"]) .portrait.is-active {
    border-color: var(--bt-chart-focus);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--bt-chart-focus) 24%, transparent);
  }

  .visual.is-engaged .portrait:not(.is-active) {
    filter: saturate(.62);
    opacity: .52;
  }

  :host([animate]) .portrait {
    animation: portrait-enter 560ms cubic-bezier(.16, 1, .3, 1) backwards;
    animation-delay: calc(120ms + var(--index) * 36ms);
  }

  @keyframes portrait-enter {
    from { opacity: 0; transform: translate(-50%, -50%) scale(.72); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  .portrait img {
    border-radius: inherit;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .portrait.media-missing {
    background: var(--bt-chart-ink);
    color: var(--bt-chart-paper);
  }

  .portrait.media-missing img { display: none; }

  .portrait:not(.media-missing) .initials { display: none; }

  .initials {
    font-size: clamp(.65rem, 1.8vw, 1rem);
    font-weight: 750;
    letter-spacing: .06em;
  }

  .portrait-label {
    background: var(--bt-chart-paper);
    border: 1px solid color-mix(in srgb, var(--bt-chart-ink) 14%, transparent);
    border-radius: 0;
    bottom: -.65rem;
    box-shadow: none;
    color: var(--bt-chart-ink);
    font-size: clamp(.55rem, 1.4vw, .72rem);
    font-weight: 750;
    left: 50%;
    line-height: 1;
    max-width: 8rem;
    overflow: hidden;
    padding: .32rem .46rem;
    position: absolute;
    text-overflow: ellipsis;
    text-transform: uppercase;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .inspector {
    align-items: start;
    border-top: 1px solid color-mix(in srgb, var(--bt-chart-ink) 12%, transparent);
    display: grid;
    gap: clamp(.75rem, 2vw, 1.4rem);
    grid-template-columns: minmax(8rem, .5fr) minmax(12rem, 1.35fr) auto;
    margin-top: .75rem;
    padding-top: 1rem;
  }

  :host([theme="reveal"]) .inspector {
    border-color: var(--bt-chart-line);
  }

  .eyebrow {
    color: var(--bt-chart-muted);
    font-size: .75rem;
    font-weight: 750;
    letter-spacing: .1em;
    margin: 0 0 .45rem;
    text-transform: uppercase;
  }

  .inspector-name {
    font-size: clamp(1.35rem, 3vw, 2.2rem);
    font-weight: 600;
    letter-spacing: -.035em;
    line-height: 1;
    margin: 0;
  }

  .inspector-promise {
    color: var(--bt-chart-ink);
    font-size: clamp(.95rem, 1.8vw, 1.1rem);
    font-weight: 600;
    line-height: 1.35;
    margin: 0 0 .35rem;
  }

  .inspector-description {
    color: var(--bt-chart-muted);
    font-size: clamp(.88rem, 1.6vw, 1rem);
    line-height: 1.45;
    margin: 0;
  }

  .inspector-score {
    min-width: 6.5rem;
    text-align: right;
  }

  .inspector-score strong {
    display: block;
    font-size: clamp(1.65rem, 3.2vw, 2.6rem);
    font-weight: 500;
    letter-spacing: -.045em;
    line-height: .95;
  }

  .inspector-score span {
    color: var(--bt-chart-muted);
    display: block;
    font-size: .75rem;
    line-height: 1.3;
    margin-top: .35rem;
  }

  .interaction-hint {
    color: var(--bt-chart-muted);
    font-size: .72rem;
    grid-column: 1 / -1;
    line-height: 1.4;
    margin: -.25rem 0 0;
  }

  :host([animate]) .inspector {
    animation: inspector-enter 520ms 560ms cubic-bezier(.16, 1, .3, 1) both;
  }

  @keyframes inspector-enter {
    from { opacity: 0; transform: translateY(.6rem); }
    to { opacity: 1; transform: translateY(0); }
  }

  details { margin-top: 1rem; }

  :host([presentation="compact"]) details { display: none; }

  summary {
    cursor: pointer;
    font-size: .9rem;
    font-weight: 700;
  }

  .table-wrap {
    margin-top: .75rem;
    overflow-x: auto;
  }

  table {
    border-collapse: collapse;
    font-size: .82rem;
    min-width: 34rem;
    width: 100%;
  }

  th, td {
    border-bottom: 1px solid color-mix(in srgb, var(--bt-chart-ink) 12%, transparent);
    padding: .6rem .5rem;
    text-align: left;
  }

  th {
    color: var(--bt-chart-muted);
    font-size: .7rem;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  th:nth-child(3), td:nth-child(3) { text-align: right; }

  .sr-only {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .error {
    background: #fff1f1;
    border: 1px solid #d43d3d;
    border-radius: .75rem;
    color: #7d1515;
    font-weight: 650;
    padding: 1rem;
  }

  @media (max-width: 36rem) {
    .frame { border-radius: min(var(--bt-chart-radius), .9rem); padding: .8rem; }
    :host([theme="reveal"]) .frame { padding: 0; }
    .visual { min-width: 0; }
    .portrait { width: 17%; }
    .portrait-label { font-size: .52rem; max-width: 5.4rem; padding: .25rem .3rem; }
    .inspector { grid-template-columns: 1fr auto; }
    .inspector-copy { grid-column: 1 / -1; grid-row: 2; }
    .inspector-score { grid-column: 2; grid-row: 1; }
    .interaction-hint { grid-row: 3; }
  }

  @media (prefers-reduced-motion: reduce) {
    .axis-line,
    .profile-node,
    .portrait,
    :host([animate]) .profile,
    :host([animate]) .portrait,
    :host([animate]) .inspector {
      animation: none;
      transition: none;
    }
  }
`;

function svgNode(name, attributes = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

function pointAt(index, count, radius, center = 500) {
  const angle = -Math.PI / 2 + Math.PI / count + (index * Math.PI * 2) / count;
  return [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius];
}

function pointList(count, radiusForIndex) {
  return Array.from({ length: count }, (_, index) =>
    pointAt(index, count, radiusForIndex(index)).join(",")
  ).join(" ");
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function mediaUrl(base, id, variant) {
  if (!base) return "";
  const cleanBase = base.replace(/\/$/, "");
  return `${cleanBase}/${encodeURIComponent(id)}-${variant.replaceAll("_", "-")}.webp`;
}

function assertCanonicalData(value) {
  if (!value || typeof value !== "object") {
    throw new TypeError("Archetype chart data must be an object.");
  }
  if (typeof value.schema_version !== "string" || !value.schema_version.trim()) {
    throw new TypeError("Archetype chart data requires schema_version.");
  }
  if (!Array.isArray(value.archetypes) || value.archetypes.length !== 12) {
    throw new TypeError("Archetype chart data requires exactly 12 archetypes.");
  }

  const ids = new Set();
  let total = 0;
  for (const item of value.archetypes) {
    if (!item || typeof item !== "object") {
      throw new TypeError("Every archetype must be an object.");
    }
    if (typeof item.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(item.id)) {
      throw new TypeError("Every archetype requires a stable lowercase id.");
    }
    if (ids.has(item.id)) throw new TypeError(`Duplicate archetype id: ${item.id}`);
    ids.add(item.id);
    for (const key of ["name", "promise", "description", "role"]) {
      if (typeof item[key] !== "string" || !item[key].trim()) {
        throw new TypeError(`Archetype ${item.id} requires ${key}.`);
      }
    }
    if (!Number.isFinite(item.weight) || item.weight < 0 || item.weight > 100) {
      throw new TypeError(`Archetype ${item.id} requires a weight from 0 to 100.`);
    }
    total += item.weight;
  }
  if (Math.abs(total - 100) > 0.1) {
    throw new TypeError(`Archetype weights must total 100, found ${total}.`);
  }
}

class BrandTherapyArchetypeChart extends HTMLElement {
  static observedAttributes = ["data-archetypes", "schema-version", "media-base", "media-variant"];

  #data = null;
  #propertyDataAssigned = false;
  #selectedId = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (!this.#propertyDataAssigned) this.#readFallbackAttribute();
    this.#render();
  }

  attributeChangedCallback() {
    if (!this.isConnected || this.#propertyDataAssigned) return;
    this.#readFallbackAttribute();
    this.#render();
  }

  set data(value) {
    this.#propertyDataAssigned = true;
    this.#data = value;
    if (this.isConnected) this.#render();
  }

  get data() {
    return this.#data;
  }

  #readFallbackAttribute() {
    const raw = this.getAttribute("data-archetypes");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      this.#data = Array.isArray(parsed)
        ? {
            schema_version: this.getAttribute("schema-version") || "",
            archetypes: parsed,
            media_base: this.getAttribute("media-base") || "",
          }
        : parsed;
    } catch (error) {
      this.#data = { parse_error: error.message };
    }
  }

  #renderError(error) {
    this.shadowRoot.replaceChildren();
    const style = document.createElement("style");
    style.textContent = styles;
    const message = document.createElement("p");
    message.className = "error";
    message.setAttribute("role", "alert");
    message.textContent = `Archetype chart unavailable: ${error.message}`;
    this.shadowRoot.append(style, message);
  }

  #render() {
    if (!this.#data) return;
    try {
      if (this.#data.parse_error) throw new TypeError(this.#data.parse_error);
      assertCanonicalData(this.#data);
    } catch (error) {
      this.#renderError(error);
      return;
    }

    const data = this.#data;
    const variant = data.media_variant || this.getAttribute("media-variant") || "with_background";
    if (!["with_background", "transparent"].includes(variant)) {
      this.#renderError(new TypeError(`Unsupported media variant: ${variant}`));
      return;
    }
    const base = data.media_base || this.getAttribute("media-base") || "";

    this.shadowRoot.replaceChildren();
    const style = document.createElement("style");
    style.textContent = styles;
    const figure = document.createElement("figure");
    figure.className = "frame";
    const visual = document.createElement("div");
    visual.className = "visual";
    const ranked = [...data.archetypes].sort((a, b) => b.weight - a.weight);
    const lead = ranked[0];
    if (!data.archetypes.some((item) => item.id === this.#selectedId)) this.#selectedId = lead.id;
    const buttons = new Map();
    const axisLines = new Map();
    const profileNodes = new Map();

    const radar = svgNode("svg", { class: "radar", viewBox: "0 0 1000 1000" });
    radar.setAttribute("aria-hidden", "true");
    for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
      const radius = 145 + 285 * fraction;
      radar.append(
        svgNode("polygon", {
          class: "grid-line",
          points: pointList(data.archetypes.length, () => radius),
        })
      );
    }
    data.archetypes.forEach((item, index) => {
      const [x, y] = pointAt(index, data.archetypes.length, 430);
      const axis = svgNode("line", { class: "axis-line", x1: 500, y1: 500, x2: x, y2: y });
      axisLines.set(item.id, axis);
      radar.append(axis);
    });
    const maxWeight = Math.max(...data.archetypes.map((item) => item.weight), 1);
    const profileRadii = data.archetypes.map((item) => 145 + 285 * (item.weight / maxWeight));
    radar.append(
      svgNode("polygon", {
        class: "profile",
        points: pointList(data.archetypes.length, (index) => profileRadii[index]),
      })
    );
    data.archetypes.forEach((item, index) => {
      const [cx, cy] = pointAt(index, data.archetypes.length, profileRadii[index]);
      const node = svgNode("circle", { class: "profile-node", cx, cy, r: 8 });
      profileNodes.set(item.id, node);
      radar.append(node);
    });
    radar.append(svgNode("circle", { class: "core", cx: 500, cy: 500, r: 138 }));
    visual.append(radar);

    data.archetypes.forEach((item, index) => {
      const [x, y] = pointAt(index, data.archetypes.length, 43, 50);
      const portrait = document.createElement("button");
      portrait.type = "button";
      portrait.className = "portrait";
      portrait.dataset.archetypeId = item.id;
      portrait.style.setProperty("--x", `${x}%`);
      portrait.style.setProperty("--y", `${y}%`);
      portrait.style.setProperty("--index", String(index));
      portrait.setAttribute("aria-controls", "archetype-inspector");
      portrait.setAttribute("aria-pressed", "false");
      portrait.setAttribute(
        "aria-label",
        `${item.name}, ${item.weight} percent, ${item.role}. ${item.promise}. ${item.description}`
      );

      const fallback = document.createElement("span");
      fallback.className = "initials";
      fallback.textContent = initials(item.name);
      portrait.append(fallback);

      const url = mediaUrl(base, item.id, variant);
      if (url) {
        const image = document.createElement("img");
        image.alt = "";
        image.loading = "lazy";
        image.decoding = "async";
        image.fetchPriority = "low";
        image.src = url;
        image.addEventListener("error", () => portrait.classList.add("media-missing"), { once: true });
        image.addEventListener("load", () => image.decode().catch(() => {}), { once: true });
        portrait.prepend(image);
      } else {
        portrait.classList.add("media-missing");
      }

      const label = document.createElement("span");
      label.className = "portrait-label";
      label.textContent = `${item.name} ${item.weight}%`;
      portrait.append(label);
      visual.append(portrait);
      buttons.set(item.id, portrait);
    });

    const caption = document.createElement("figcaption");
    caption.className = "inspector";
    caption.id = "archetype-inspector";
    const identity = document.createElement("div");
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Explore the system";
    const inspectorName = document.createElement("h3");
    inspectorName.className = "inspector-name";
    identity.append(eyebrow, inspectorName);
    const inspectorCopy = document.createElement("div");
    inspectorCopy.className = "inspector-copy";
    const inspectorPromise = document.createElement("p");
    inspectorPromise.className = "inspector-promise";
    const inspectorDescription = document.createElement("p");
    inspectorDescription.className = "inspector-description";
    inspectorCopy.append(inspectorPromise, inspectorDescription);
    const inspectorScore = document.createElement("div");
    inspectorScore.className = "inspector-score";
    const scoreValue = document.createElement("strong");
    const scoreRole = document.createElement("span");
    inspectorScore.append(scoreValue, scoreRole);
    const interactionHint = document.createElement("p");
    interactionHint.className = "interaction-hint";
    interactionHint.textContent = "Hover, tap, or use the arrow keys to understand each archetype.";
    const selectionStatus = document.createElement("p");
    selectionStatus.className = "sr-only";
    selectionStatus.setAttribute("role", "status");
    caption.append(identity, inspectorCopy, inspectorScore, interactionHint, selectionStatus);

    const details = document.createElement("details");
    const detailsSummary = document.createElement("summary");
    detailsSummary.textContent = "View all archetype scores";
    const tableWrap = document.createElement("div");
    tableWrap.className = "table-wrap";
    const table = document.createElement("table");
    const tableCaption = document.createElement("caption");
    tableCaption.textContent = "Complete brand personality archetype distribution";
    tableCaption.className = "sr-only";
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const heading of ["Archetype", "Promise", "Weight", "Role"]) {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = heading;
      headRow.append(cell);
    }
    head.append(headRow);
    const body = document.createElement("tbody");
    for (const item of data.archetypes) {
      const row = document.createElement("tr");
      for (const value of [item.name, item.promise, `${item.weight}%`, item.role]) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      }
      body.append(row);
    }
    table.append(tableCaption, head, body);
    tableWrap.append(table);
    details.append(detailsSummary, tableWrap);
    const titleCase = value => value ? value[0].toUpperCase() + value.slice(1) : "";
    const select = (id, { engaged = false, announce = false } = {}) => {
      const item = data.archetypes.find((candidate) => candidate.id === id) || lead;
      visual.classList.toggle("is-engaged", engaged);
      inspectorName.textContent = item.name;
      inspectorPromise.textContent = item.promise;
      inspectorDescription.textContent = item.description;
      scoreValue.textContent = `${item.weight}%`;
      scoreRole.textContent = item.weight === 0 ? "Not active in this blend" : `${titleCase(item.role)} role`;
      for (const [candidateId, button] of buttons) {
        const active = candidateId === item.id;
        button.classList.toggle("is-active", active);
        button.tabIndex = candidateId === this.#selectedId ? 0 : -1;
        button.setAttribute("aria-pressed", candidateId === this.#selectedId ? "true" : "false");
        axisLines.get(candidateId)?.classList.toggle("is-active", active);
        profileNodes.get(candidateId)?.classList.toggle("is-active", active);
      }
      if (announce) selectionStatus.textContent = `${item.name} selected. ${item.promise}.`;
    };

    const orderedIds = data.archetypes.map((item) => item.id);
    buttons.forEach((button, id) => {
      button.addEventListener("pointerenter", () => select(id, { engaged: true }));
      button.addEventListener("pointerleave", () => select(this.#selectedId));
      button.addEventListener("focus", () => select(id, { engaged: true }));
      button.addEventListener("blur", () => {
        queueMicrotask(() => {
          if (!this.shadowRoot.activeElement?.classList.contains("portrait")) select(this.#selectedId);
        });
      });
      button.addEventListener("click", () => {
        this.#selectedId = id;
        select(id, { engaged: true, announce: true });
      });
      button.addEventListener("keydown", (event) => {
        const current = orderedIds.indexOf(id);
        let next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % orderedIds.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + orderedIds.length) % orderedIds.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = orderedIds.length - 1;
        if (next === null) return;
        event.preventDefault();
        event.stopPropagation();
        buttons.get(orderedIds[next])?.focus();
      });
    });

    figure.append(visual, caption, details);
    this.shadowRoot.append(style, figure);
    select(this.#selectedId);
  }
}

if (!customElements.get(COMPONENT_NAME)) {
  customElements.define(COMPONENT_NAME, BrandTherapyArchetypeChart);
}
