# Design System Export Script

Generates the Lilly's Box design system as **HTML**, **PPTX**, and **PDF**.

## Usage

```bash
# From the repo root — installs deps & generates all three formats
npm run design-system:export

# Skip PDF (faster, no Chromium download required)
npm run design-system:export:no-pdf

# Or run directly
cd scripts/generate-design-system
npm install
node generate.js [--no-pdf] [--output=<path>]
```

## Output

Files are written to `docs/design-system/exports/`:

| File | Description |
|------|-------------|
| `design-system.html` | Standalone HTML reference (opens in any browser, printable) |
| `design-system.pptx` | PowerPoint presentation (16 slides) |
| `design-system.pdf`  | PDF generated from the HTML via Puppeteer/Chromium |

> Generated files are listed in `.gitignore` and are **not** committed to the repo.

## What's included

| Section | Content |
|---------|---------|
| Cover | Title, tech stack |
| Color Palette | Brand · Semantic · Feedback · Surface · Text · Scene backgrounds · Quilt (swatches + hex + usage) |
| Typography | 12 font sizes with live samples · 5 font weights |
| Spacing | Full scale (2 – 40 px) with visual bars |
| Border Radius | 6 tokens with shape demos |
| Shadows | 5 levels (CSS values + RN config) |
| Components | IconButton · ScreenHeader · ConfirmModal · StatusCard · EmojiIcon (props + specs) |
| Screen Themes | All 18 screens with background colours |
| Breakpoints | mobile / mobileLarge / tablet / desktop |
| Animations | Duration tokens · Spring configs |

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `pptxgenjs` | 3.12.0 | PPTX generation |
| `puppeteer` | 22.15.0 | PDF via headless Chromium |
