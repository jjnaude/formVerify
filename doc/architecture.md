# formVerify Architecture

## Overview

formVerify is a Progressive Web App (PWA) that verifies handwritten numerical fields on healthcare waste manifest forms. The app captures a photo, orthorectifies the form using ArUco fiducial markers, extracts regions of interest (ROI), runs OCR, and presents results for human verification.

## Why a PWA?

- Sufficient camera access via MediaDevices API for photographing A4 forms
- OpenCV.js (WASM) provides ArUco detection and perspective correction in-browser
- Fully offline capable via service workers
- No app store deployment needed — URL-based with instant updates
- Lightweight devcontainer (Node.js only, no Android SDK)

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI Framework | Lit 3 (web components) | Lightweight, standards-based components |
| Build | Vite 6 + TypeScript 5 | Fast dev server, WASM support, type safety |
| Computer Vision | OpenCV.js (WASM) | ArUco marker detection, perspective transform |
| OCR | Tesseract.js 5 | Handwritten digit recognition |
| Storage | IndexedDB (via idb) | Local image and data storage |
| PWA | vite-plugin-pwa + Workbox | Service worker, offline caching |
| Testing | Vitest + Playwright | Unit and E2E tests |

## Processing Pipeline

```
Camera Capture (high-res JPEG)
  → [1] ArUco Detection (OpenCV.js)
        Detect 4 corner markers (DICT_4X4_50, IDs 0-3)
  → [2] Perspective Correction
        Homography + warpPerspective → flat A4 image
  → [3] ROI Extraction
        Crop cells using fixed coordinates from FormSchema
  → [4] OCR (Tesseract.js)
        Digit-only whitelist, PSM 7 (single line mode)
  → [5] Human Verification UI
        Review recognized values, correct errors
  → [6] Export
        JSON/CSV download
```

## Form Design

The physical form includes 4 ArUco markers (DICT_4X4_50) at the corners, enabling reliable localization regardless of camera angle. Since we control the form design, all field coordinates are fixed relative to these markers.

### Target Fields

- **Tracking No** — top of form (future: barcode/QR code)
- **Table1** — 3 rows (Received, Gross KG, Nett KG) × 14 container-size columns

## Project Structure

```
formVerify/
  .devcontainer/       — Dev container config (Node 22 LTS)
  doc/                 — Documentation and phase reports
  src/
    components/        — Lit web components (UI)
    pipeline/          — Image processing pipeline modules
    models/            — Data types and form schema definitions
    utils/             — Helpers (OpenCV loader, image utils)
    assets/            — ArUco marker images
  tests/               — Unit and E2E tests
  index.html           — Entry point
  vite.config.ts       — Vite + PWA config
```

## Key Design Decisions

1. **All processing is client-side** — no server required, full offline capability
2. **Fixed form schema** — cell coordinates hardcoded relative to ArUco markers (form design is controlled)
3. **Tesseract.js first, custom model later** — pragmatic accuracy progression
4. **IndexedDB for storage** — images, results, and correction history stored locally
5. **ArUco over AprilTag** — built into OpenCV.js, no extra dependencies

## Phase Plan

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Project scaffolding, devcontainer | Complete |
| 1 | Camera capture component | Pending |
| 2 | ArUco detection + perspective correction | Pending |
| 3 | ROI extraction + OCR | Pending |
| 4 | Verification UI | Pending |
| 5 | Export + polish | Pending |
| 6 | Custom OCR model + barcode support | Future |
