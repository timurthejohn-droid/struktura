# STRUKTURA — page map for Claude Code

This folder is a refactored version of the original single-file HTML. The visual content and embedded JPEG bytes are preserved; heavy Base64 images were moved to separate files.

## Files

- `index.html` — page markup only (~30 KB), with relative asset paths.
- `assets/styles.css` — all page styles.
- `assets/app.js` — page interactions.
- `assets/images/` — 19 JPEG assets extracted from Base64 without recompression.
- `ASSETS.md` — image manifest and dimensions.

## Page structure

1. `header.header`
   - STRUKTURA+ logo
   - desktop navigation
   - CTA “Обсудить проект →”

2. `section.hero`
   - headline: “От цифровой модели — к физической системе”
   - explanatory copy and 10+ years badge
   - main project image + stacked engineering visuals

3. Section `01`
   - “Силовая основа и точная геометрия — в одной системе”
   - exploded subsystem diagram / engineering copy
   - V3 comparison block: two approaches to a complex form

4. Engineering process / timeline section
   - multi-step horizontal timeline on desktop, stacked on mobile

5. Four capability cards
   - design / production / assembly / related subsystem capability content

6. Algorithm / system logic section
   - dark section with circular node map
   - clickable nodes controlled by `assets/app.js`
   - project-specific factor copy

7. Materials section
   - five material groups with generated texture swatches

8. Industrial chain section
   - CAM → CNC/Robot/Additive → marking → assembly flow
   - statement about standardizing implementation rather than architecture
   - interactive assembly/joint visualization

9. Section `07` — cases
   - Сбербанк-Сити
   - Moscow Tower
   - Лахта Центр
   - project images + digital fragments + descriptions

10. Section `08` — engineering verification
    - calculation → prototype → testing → project verification
    - image grid, verification list, chart

11. Footer
    - final CTA and explanatory note

## Responsive behavior

Main breakpoints in `assets/styles.css`:
- `max-width: 980px`
- `max-width: 800px`
- `max-width: 650px`

Navigation hides on smaller screens; grids collapse from multi-column to single-column layouts.

## Important editing rule

Do not paste image contents back into HTML as Base64. Keep images as files in `assets/images/` and reference them with relative URLs. This keeps Claude Code context small and prevents prompt/context-size errors.

## Recommended Claude Code workflow

Ask Claude to inspect `STRUCTURE.md` first, then only the relevant files. Example:

> Read `STRUCTURE.md` and inspect `index.html` + `assets/styles.css`. Do not inline images or convert assets to Base64. Make the requested changes while preserving the current responsive layout and visual language. Only inspect `assets/app.js` if interaction logic needs to change.
