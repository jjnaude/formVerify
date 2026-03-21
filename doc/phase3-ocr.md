# Phase 3: ROI Extraction + OCR — Complete

## What Was Done

1. **Form schema** (`src/models/form-schema.ts`):
   - Defines ROI positions for all 42 table cells (3 rows × 14 columns) plus tracking number
   - Coordinates measured from `public/test-form.html` using Playwright
   - All positions normalized (0–1) relative to the corrected image dimensions

2. **ROI extractor** (`src/pipeline/roi-extractor.ts`):
   - Crops cells from the corrected cv.Mat using schema coordinates
   - Converts each crop to ImageData for Tesseract consumption
   - Clamps to image bounds (handles cells near edges)

3. **OCR module** (`src/pipeline/ocr.ts`):
   - Tesseract.js 5 with digit-only whitelist (`0123456789.`)
   - PSM 7 (single line mode) for individual cell recognition
   - Worker loaded from CDN, reused across calls
   - Progress callback support

4. **Updated image-processor component**:
   - Extended pipeline: detect → correct → extract ROIs → OCR
   - Results displayed as a table matching the manifest layout
   - Low-confidence values highlighted in orange
   - Tracking number shown in info bar
   - Progress indicator during OCR (N/M cells)

## Current Status

- `npx tsc --noEmit` — compiles cleanly
- `npm run build` — builds (61 KB app + 10.3 MB OpenCV)
- `npm run test` — 15 tests passing
- Full pipeline: capture → markers → perspective → ROI → OCR → results table

## New Files

```
src/models/form-schema.ts        — ROI coordinate definitions
src/pipeline/roi-extractor.ts    — Cell cropping from corrected image
src/pipeline/ocr.ts              — Tesseract.js digit OCR
```

## Next Steps (Phase 4: Verification UI)

1. Build an editable results table where users can correct OCR errors
2. Show cell thumbnails alongside recognized values
3. Add ability to re-process or skip individual cells
4. Store verified results in IndexedDB
