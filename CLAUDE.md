# formVerify

## Project Summary

PWA to verify handwritten numerical fields on healthcare waste manifest forms. Captures a photo, orthorectifies using ArUco markers, crops fields, runs OCR, presents results for human verification.

## Tech Stack

- **Vite 6 + TypeScript 5 + Lit 3** (web components)
- **OpenCV.js** (WASM) — ArUco marker detection + perspective correction (not yet added)
- **Tesseract.js 5** — OCR for handwritten digits (not yet added)
- **IndexedDB** via `idb` — local storage
- **vite-plugin-pwa** + Workbox — offline capability
- **Vitest** — unit tests

## Commands

- `npm run dev` — Start dev server (with `--host` for mobile access)
- `npm run build` — TypeScript check + Vite production build
- `npm run test` — Run tests with Vitest
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Current Status

**Phase 0 (Scaffolding) — COMPLETE.** See `doc/phase0-scaffolding.md`.

**Phase 1 (Camera Capture) — NEXT.** See plan details in `doc/architecture.md` and `doc/phase0-scaffolding.md` (next steps section).

## Implementation Plan

Full phased plan is in `doc/architecture.md`. Summary:

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Project scaffolding, devcontainer | **Complete** |
| 1 | Camera capture component | Next |
| 2 | ArUco detection + perspective correction | Pending |
| 3 | ROI extraction + OCR | Pending |
| 4 | Verification UI | Pending |
| 5 | Export + polish | Pending |
| 6 | Custom OCR model + barcode support | Future |

## Key Design Decisions

- **PWA, not native Android** — user has PWA experience, sufficient camera API, simpler deployment
- **ArUco markers (DICT_4X4_50)** — 4 corner markers on the form for reliable localization; built into OpenCV.js
- **All processing client-side** — fully offline, no backend
- **Fixed form schema** — cell coordinates are constants measured from the form layout (user controls form design)
- **Tesseract.js first, custom ONNX model later** — pragmatic accuracy progression

## Key Files

- `doc/current manifest design.pdf` — Reference form (waste manifest with handwritten fields)
- `doc/architecture.md` — Full technical architecture and design rationale
- `doc/phase0-scaffolding.md` — Phase 0 completion report with next steps
- `src/components/app-shell.ts` — Main app shell component
- `vite.config.ts` — Vite + PWA configuration

## Documentation Convention

After completing each phase, create `doc/phaseN-<name>.md` documenting what was done, current status, and next steps.

## Form Fields to Extract

From the waste manifest (see `doc/current manifest design.pdf`):
- **Tracking No** — top of form (future: barcode/QR)
- **Table1** — 3 rows × ~14 columns:
  - Rows: Received, Gross KG, Nett KG
  - Columns: 90L RUC, 7.6L Sharps, 20L Sharps, 25L Sharps, 2.5L Specibin, 5L Specibin, 10L Specibin, 20L Specibin, 25L Specibin, Pharma 5L, Pharma 20L, 50L Box, 142L Box, Other
