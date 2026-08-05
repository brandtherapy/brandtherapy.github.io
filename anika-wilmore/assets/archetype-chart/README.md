# Brand Therapy Archetype Chart

Interactive, client-agnostic renderer for a validated Brand Therapy archetype mix.
The canonical archetype IDs, names, promises, descriptions, order, roles, and weights come
from the data assigned by the consumer. This component does not own a second
archetype registry and does not normalize or repair canonical data.

## Stable browser API

Load `archetype-chart.js`, then assign the canonical payload:

```html
<bt-archetype-chart id="archetype-chart" animate></bt-archetype-chart>
<script src="./archetype-chart.js"></script>
<script>
  document.querySelector("#archetype-chart").data = {
    schema_version: "brand-therapy-contract/v2",
    media_base: "./assets/archetype-chart",
    media_variant: "with_background",
    archetypes: canonicalArchetypes
  };
</script>
```

Each `archetypes` entry must contain `id`, `name`, `promise`, `description`,
`weight`, and `role`. The array must contain all 12 unique archetypes, remain in canonical
display order, and total 100. Assigning `.data` again rerenders the component.

For static local previews only, `data-archetypes` may contain the same payload
as JSON. It may instead contain only the archetype array when `schema-version`,
`media-base`, and optional `media-variant` attributes are present. Property data
always takes precedence over attribute fallback data.

Missing or failed media falls back to a labeled initial. Invalid canonical data
fails closed with an accessible error. The complete values remain available in
a semantic table. Hover and focus preview an archetype. Click or tap pins it.
Arrow keys, Home, and End move between the 12 native portrait buttons. The
`theme="reveal"` attribute uses the transparent, sharp reveal treatment, while
the default light treatment remains available to the workshop. The optional
`presentation="compact"` attribute hides the secondary table when the inline
inspector is sufficient. The radar profile scales the highest supplied weight to the
outer ring so a 100-point distribution remains legible; labels and the table
always show the exact weights. Images are lazy-loaded and asynchronously
decoded. Motion is opt-in with `animate` and disabled when reduced motion is
requested.

## Asset boundary

`asset-manifest.json` is the tracked policy and provenance record. Its
`display_order` is a generated snapshot of the canonical order in
`brand-therapy-contract.v2.json`; `source_extraction_order` only maps the
original SVG layer sequence to the correct portraits. The ignored
design SSOT and generated runtime media live under
`marketing/brand-assets/brand-therapy/archetypes/`.

The current imagery is `internal_only` and `local_preview_only`. It includes
recognizable character and celebrity likenesses. Never package these files into
a public or client-facing build until the rights status is explicitly replaced
with an approved public-safe source.

The 21.5 MB SVG is build-only. Runtime code must reference only the fixed-size
WebP derivatives.

Regenerate the ignored runtime pack and atomically sync this tracked policy with
`python3 tools/extract_archetype_assets.py --sync-policy-manifest` from the FP
repo root.
