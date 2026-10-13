# STRUKTURA — Claude Code optimized build

Original source: `STRUKTURA_Subsystems_HD_v3 (1)(1).html`

## Why the original was too large

The original file was 4,745,835 bytes and contained 19 JPEG images embedded as Base64 strings. Those strings dominate the text context sent to an LLM.

## Refactor result

- Working HTML: `index.html`
- HTML size: 30,686 bytes
- CSS: `assets/styles.css`
- JS: `assets/app.js`
- Images: `assets/images/`
- Base64 images remaining in HTML: 0

No JPEG was recompressed; image bytes were extracted exactly from the original document.

## Open locally

You can open `index.html` directly in a browser. For development, a local HTTP server is preferable.

## For Claude Code

Start by giving Claude this instruction:

> Read `STRUCTURE.md`. Work with `index.html`, `assets/styles.css`, and `assets/app.js` as needed. Never inline images as Base64. Keep all image references relative to `assets/images/`.

## Existing unresolved links

The original markup contains two relative links to `STRUKTURA_Digital_Core_v2.html`. That target file was not part of the upload, so the links were preserved unchanged and remain unresolved in this package.
