/**
 * ROI (Region of Interest) extraction from a corrected form image.
 *
 * Crops individual cells from the orthorectified image using the
 * normalized coordinates defined in the form schema, then applies
 * preprocessing (grayscale, contrast enhancement, binarization).
 */

import type { CellROI } from '../models/form-schema.js';
import { preprocessCell } from './preprocess.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

export interface ExtractedROI {
  cell: CellROI;
  /** Raw cropped cell image as ImageData */
  imageData: ImageData;
  /** Preprocessed (binarized) cell image as ImageData */
  preprocessedData: ImageData;
}

/**
 * Extract ROI cells from a corrected image.
 *
 * @param cv - OpenCV.js module
 * @param corrected - Orthorectified image as cv.Mat
 * @param cells - Cell definitions with normalized coordinates
 * @returns Array of extracted ROIs with raw and preprocessed ImageData
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
      // Raw crop → ImageData
      const rawCanvas = document.createElement('canvas');
      rawCanvas.width = pw;
      rawCanvas.height = ph;
      cv.imshow(rawCanvas, roi);
      const rawCtx = rawCanvas.getContext('2d')!;
      const imageData = rawCtx.getImageData(0, 0, pw, ph);

      // Preprocessed crop → ImageData
      const preprocessed = preprocessCell(cv, roi);
      const ppCanvas = document.createElement('canvas');
      ppCanvas.width = preprocessed.cols;
      ppCanvas.height = preprocessed.rows;
      cv.imshow(ppCanvas, preprocessed);
      const ppCtx = ppCanvas.getContext('2d')!;
      const preprocessedData = ppCtx.getImageData(
        0, 0, preprocessed.cols, preprocessed.rows,
      );
      preprocessed.delete();

      results.push({ cell, imageData, preprocessedData });
    } finally {
      roi.delete();
    }
  }

  return results;
}
