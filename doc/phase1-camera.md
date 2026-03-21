# Phase 1: Camera Capture — Complete

## What Was Done

1. **`<camera-capture>` component** (`src/components/camera-capture.ts`):
   - `getUserMedia()` with rear camera preference (`facingMode: environment`)
   - Requests high-res (up to 4K) for downstream ArUco detection
   - Live viewfinder with A4 portrait guide overlay and corner markers
   - State machine: idle → streaming → preview → (accept/retake)
   - Captures to JPEG blob (quality 0.92) via canvas
   - Dispatches `capture-saved` custom event with the IndexedDB record ID

2. **IndexedDB storage** (`src/utils/db.ts`):
   - Database `formVerify`, object store `captures` with auto-increment key
   - Indexes: `by-timestamp`, `by-status`
   - CRUD API: `saveCapture`, `getCapture`, `getAllCaptures`, `deleteCapture`, `updateCaptureStatus`
   - Capture records store: `blob`, `timestamp`, `status` (captured | processed | verified)

3. **App shell updated** (`src/components/app-shell.ts`):
   - Home view with "Capture Form" button
   - Camera view with back navigation
   - Toast notification on successful capture
   - Simple view-based routing (home/camera)

4. **Tests** (`tests/utils/db.test.ts`):
   - 6 tests covering save, retrieve, list, delete, status update, and edge cases
   - Uses `fake-indexeddb` for Node.js IndexedDB emulation

## Current Status

- `npx tsc --noEmit` — compiles cleanly
- `npm run build` — builds successfully (32 KiB precached)
- `npm run test` — 6 tests passing
- Camera requires HTTPS or localhost (standard browser security)

## New Files

```
src/components/camera-capture.ts  — Camera capture component
src/utils/db.ts                   — IndexedDB storage module
tests/utils/db.test.ts            — DB unit tests
```

## Next Steps (Phase 2: ArUco Detection + Perspective Correction)

1. Add OpenCV.js (WASM) to the project
2. Create ArUco detector module to find 4 corner markers (DICT_4X4_50, IDs 0-3)
3. Compute homography and apply `warpPerspective` for orthorectification
4. Integrate into pipeline: capture → detect markers → correct perspective
5. Add visual feedback showing detected markers
6. Test with printed forms containing ArUco markers
