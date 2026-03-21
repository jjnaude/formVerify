# Phase 4: OCR Accuracy — Complete

## Problem

Tesseract.js OCR on handwritten digits had ~50% accuracy:
- "3" read as "8", "2,0" unreadable, blanks read as "5"
- Tesseract is trained on printed text, not handwriting
- Comma/decimal ambiguity in freeform cells

## Solution: Two-pronged approach

### A. Preprocessing pipeline (quick wins)
- **CLAHE contrast enhancement** + **Otsu binarization** for clean black/white input
- **3px border inset** to remove grid line artifacts from cell crops
- **Resolution bump** from 150 to 200 DPI (1654×2339 px)
- Raw vs preprocessed preview side-by-side in cell inspection

### B. Form redesign + MNIST classifier (accuracy fix)
- **Landscape A4 form** with individual digit boxes (one digit per box)
- Printed decimal separators (commas) — no handwritten decimals
- Received row: 3 digits per field (whole numbers)
- Gross/Nett KG rows: 3 digits + comma + 1 digit
- **ONNX Runtime Web** replaces Tesseract for digit classification
- **Quantized MNIST int8 model** (11 KB) — 99%+ accuracy on single digits
- Tesseract kept only for tracking number (multi-character field)

## What Was Done

1. **`src/pipeline/preprocess.ts`** — NEW: grayscale → CLAHE → Otsu → border inset
2. **`src/pipeline/digit-classifier.ts`** — NEW: ONNX MNIST wrapper (init, classify, softmax)
3. **`src/pipeline/ocr.ts`** — Rewritten: ONNX for digit boxes, Tesseract for tracking only
4. **`src/pipeline/roi-extractor.ts`** — Now outputs both raw and preprocessed ImageData
5. **`src/pipeline/perspective.ts`** — Bumped to 200 DPI
6. **`src/models/form-schema.ts`** — Rewritten: per-digit-box schema with field reassembly
7. **`public/test-form.html`** — Redesigned: landscape, digit boxes, printed decimal marks
8. **`src/components/image-processor.ts`** — Updated: shows assembled field values, raw/preprocessed preview
9. **`vite.config.ts`** — WASM files cached at runtime instead of precached

## New Dependencies

- `onnxruntime-web` — ONNX inference engine (102 KB JS + 25 MB WASM, runtime-cached)
- `public/models/mnist-12-int8.onnx` — Quantized MNIST model (11 KB, downloaded in CI)

## Current Status

- TypeScript compiles cleanly
- 15 tests passing
- Production build succeeds (470 KB app JS + 10.3 MB OpenCV + 25 MB ONNX WASM)
- WASM files runtime-cached (not precached) to keep initial load fast

## Known Limitations

- Last 5 columns extend past right marker edge (x > 1.0) — form layout needs adjustment
- ONNX WASM is 25 MB (cached after first use) — significant first-load cost
- Digit box coordinates need manual measurement for each form revision
