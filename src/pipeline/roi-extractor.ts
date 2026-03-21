/**
 * ROI (Region of Interest) extraction from a corrected form image.
 *
 * Crops individual cells from the orthorectified image using the
 * normalized coordinates defined in the form schema.
 */

import type { CellROI } from '../models/form-schema.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

export interface ExtractedROI {
  cell: CellROI;
  /** Cropped cell image as ImageData */
  imageData: ImageData;
}

/**
 * Extract ROI cells from a corrected image.
 *
 * @param cv - OpenCV.js module
 * @param corrected - Orthorectified image as cv.Mat
 * @param cells - Cell definitions with normalized coordinates
 * @returns Array of extracted ROIs with their ImageData
 */
export function extractROIs(
  cv: CV,
  corrected: CV,
  cells: CellROI[],
): ExtractedROI[] {
  const imgW = corrected.cols;
  const imgH = corrected.rows;
  const results: ExtractedROI[] = [];

  for (const cell of cells) {
    // Convert normalized coords to pixel coords, clamped to image bounds
    const px = Math.max(0, Math.round(cell.x * imgW));
    const py = Math.max(0, Math.round(cell.y * imgH));
    const pw = Math.min(Math.round(cell.w * imgW), imgW - px);
    const ph = Math.min(Math.round(cell.h * imgH), imgH - py);

    // Skip cells that are fully outside the image
    if (pw <= 0 || ph <= 0) continue;

    const rect = new cv.Rect(px, py, pw, ph);
    const roi = corrected.roi(rect);

    try {
      // Convert to canvas-compatible format and extract ImageData
      const canvas = document.createElement('canvas');
      canvas.width = pw;
      canvas.height = ph;
      cv.imshow(canvas, roi);
      const ctx = canvas.getContext('2d')!;
      const imageData = ctx.getImageData(0, 0, pw, ph);

      results.push({ cell, imageData });
    } finally {
      roi.delete();
    }
  }

  return results;
}
