# Phase 2: ArUco Detection + Perspective Correction — Complete

## What Was Done

1. **OpenCV.js integration** (`@techstark/opencv-js`):
   - Async WASM loader (`src/utils/opencv-loader.ts`) with singleton pattern
   - Dynamically imported — OpenCV (~10.8 MB) only loads when processing starts
   - Workbox cache limit increased to 15 MB for offline caching

2. **ArUco DICT_4X4_50 detector** (`src/pipeline/aruco-detector.ts` + `aruco-dict.ts`):
   - Custom implementation using OpenCV's image processing primitives (no dependency on `cv.aruco` module)
   - Pipeline: grayscale → adaptive threshold → contour detection → polygon approximation → quadrilateral filtering → perspective-correct each candidate → read 4×4 bit pattern → match against dictionary
   - Dictionary data for IDs 0–3 with rotation support (`aruco-dict.ts`)
   - De-duplication: keeps largest detection per ID

3. **Perspective correction** (`src/pipeline/perspective.ts`):
   - Uses inner corners of 4 ArUco markers to define source quadrilateral
   - Maps to A4 at 150 DPI (1240 × 1754 px) via `getPerspectiveTransform` + `warpPerspective`
   - Marker layout: ID 0 = TL, ID 1 = TR, ID 2 = BR, ID 3 = BL
   - `matToBlob()` utility for converting cv.Mat back to JPEG

4. **Processing UI** (`src/components/image-processor.ts`):
   - Progress states: loading OpenCV → detecting markers → correcting perspective → done/error
   - Shows corrected image result with marker count
   - Error messaging when fewer than 4 markers detected
   - Saves corrected image to IndexedDB, updates original capture status

5. **App shell updated** — new `processing` view after camera capture

6. **Tests** (`tests/pipeline/aruco-dict.test.ts`):
   - 9 tests for dictionary data, rotation, and matching logic

## Current Status

- `npx tsc --noEmit` — compiles cleanly
- `npm run build` — builds (10.8 MB OpenCV chunk, 42 KB app code)
- `npm run test` — 15 tests passing (9 aruco-dict + 6 db)
- Full pipeline: capture → detect markers → correct perspective → save

## New Files

```
src/utils/opencv-loader.ts           — Async OpenCV.js WASM loader
src/pipeline/aruco-dict.ts           — DICT_4X4_50 data + rotation/matching
src/pipeline/aruco-detector.ts       — Marker detection using OpenCV primitives
src/pipeline/perspective.ts          — Perspective correction + mat-to-blob
src/components/image-processor.ts    — Processing UI component
tests/pipeline/aruco-dict.test.ts    — Dictionary unit tests
```

## Design Decisions

- **Custom ArUco detector over cv.aruco**: The standard `@techstark/opencv-js` build may not include the ArUco module. Our detector uses core OpenCV functions (threshold, contours, perspective transform) which are always available, plus TypeScript bit-pattern matching for the dictionary.
- **A4 at 150 DPI**: Balances quality and processing speed. Sufficient for OCR in Phase 3.
- **Inner marker corners**: Using the corner of each marker closest to the form center gives the tightest crop of the actual form content.

## Next Steps (Phase 3: ROI Extraction + OCR)

1. Define form schema with cell coordinates relative to the corrected A4 image
2. Crop ROI cells from the corrected image
3. Add Tesseract.js for digit OCR (whitelist digits, PSM 7)
4. Run OCR on each cropped cell
5. Store OCR results alongside capture records
