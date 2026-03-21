/**
 * ROI (Region of Interest) extraction from a corrected form image.
 *
 * Two-stage approach:
 * 1. Extract an oversized region (~60% padding) around the expected box position
 * 2. Detect the actual printed rectangle within that region using contour detection
 * 3. Crop precisely to the interior of the detected rectangle
 * 4. Apply preprocessing (grayscale, contrast, binarization)
 */

import type { CellROI } from '../models/form-schema.js';
import { preprocessCell } from './preprocess.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

/** How much to expand the search region beyond the nominal box (fraction of box size). */
const SEARCH_MARGIN = 0.6;

/** Pixels to inset from the detected rectangle edge to exclude the printed border line. */
const RECT_BORDER_INSET = 2;

export interface ExtractedROI {
  cell: CellROI;
  /** Raw cropped cell image as ImageData (after box detection) */
  imageData: ImageData;
  /** Preprocessed (binarized) cell image as ImageData */
  preprocessedData: ImageData;
  /** Debug: oversized search region before box detection */
  debugSearchRegion?: ImageData;
  /** Debug: search region with detected contours drawn */
  debugContours?: ImageData;
  /** Whether a printed box was detected (vs fallback to nominal) */
  boxDetected: boolean;
}

/**
 * Extract ROI cells from a corrected image using closed-loop box detection.
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
    // Compute nominal box in pixels
    const nomX = cell.x * imgW;
    const nomY = cell.y * imgH;
    const nomW = cell.w * imgW;
    const nomH = cell.h * imgH;

    // Expand search region
    const marginX = nomW * SEARCH_MARGIN;
    const marginY = nomH * SEARCH_MARGIN;
    const sx = Math.max(0, Math.round(nomX - marginX));
    const sy = Math.max(0, Math.round(nomY - marginY));
    const sw = Math.min(Math.round(nomW + 2 * marginX), imgW - sx);
    const sh = Math.min(Math.round(nomH + 2 * marginY), imgH - sy);

    if (sw <= 0 || sh <= 0) continue;

    const searchRect = new cv.Rect(sx, sy, sw, sh);
    const searchROI = corrected.roi(searchRect);

    try {
      // Debug: capture search region
      const debugSearchRegion = matToImageData(cv, searchROI);

      // Detect the printed box within the search region
      const detection = detectPrintedBox(cv, searchROI, nomW, nomH);
      const detected = detection.rect;

      // Debug: draw contours + detected rect on search region copy
      const debugContours = createDebugContourImage(
        cv, searchROI, detection.allRects, detected,
      );

      let cropMat: CV;
      const boxDetected = detected !== null;
      if (detected) {
        // Inset from detected rectangle to exclude the printed border
        const inset = RECT_BORDER_INSET;
        const dx = Math.min(inset, Math.floor(detected.w / 4));
        const dy = Math.min(inset, Math.floor(detected.h / 4));
        const cropRect = new cv.Rect(
          detected.x + dx,
          detected.y + dy,
          detected.w - 2 * dx,
          detected.h - 2 * dy,
        );
        const cropped = searchROI.roi(cropRect);
        cropMat = new cv.Mat();
        cropped.copyTo(cropMat);
        cropped.delete();
      } else {
        // Fallback: use nominal position (center of search region)
        const fallbackX = Math.round(marginX);
        const fallbackY = Math.round(marginY);
        const fallbackW = Math.round(nomW);
        const fallbackH = Math.round(nomH);
        const fbRect = new cv.Rect(
          Math.min(fallbackX, sw - 1),
          Math.min(fallbackY, sh - 1),
          Math.min(fallbackW, sw - fallbackX),
          Math.min(fallbackH, sh - fallbackY),
        );
        const cropped = searchROI.roi(fbRect);
        cropMat = new cv.Mat();
        cropped.copyTo(cropMat);
        cropped.delete();
      }

      // Raw crop → ImageData
      const imageData = matToImageData(cv, cropMat);

      // Preprocessed crop → ImageData
      const preprocessed = preprocessCell(cv, cropMat);
      const preprocessedData = matToImageData(cv, preprocessed);
      preprocessed.delete();
      cropMat.delete();

      results.push({
        cell, imageData, preprocessedData,
        debugSearchRegion, debugContours, boxDetected,
      });
    } finally {
      searchROI.delete();
    }
  }

  return results;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DetectionResult {
  rect: Rect | null;
  allRects: Rect[];
}

/**
 * Detect the printed digit box rectangle within a search region.
 *
 * Returns the best matching rectangle and all candidate rectangles for debugging.
 */
function detectPrintedBox(
  cv: CV,
  searchRegion: CV,
  expectedW: number,
  expectedH: number,
): DetectionResult {
  const gray = new cv.Mat();
  const thresh = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    // Grayscale
    if (searchRegion.channels() === 4) {
      cv.cvtColor(searchRegion, gray, cv.COLOR_RGBA2GRAY);
    } else if (searchRegion.channels() === 3) {
      cv.cvtColor(searchRegion, gray, cv.COLOR_RGB2GRAY);
    } else {
      searchRegion.copyTo(gray);
    }

    // Adaptive threshold to find printed lines
    const blockSize = Math.max(3, Math.round(gray.cols / 8) | 1);
    cv.adaptiveThreshold(
      gray, thresh, 255,
      cv.ADAPTIVE_THRESH_MEAN_C,
      cv.THRESH_BINARY_INV,
      blockSize, 10,
    );

    // Find contours
    cv.findContours(thresh, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    const regionW = searchRegion.cols;
    const regionH = searchRegion.rows;
    const centerX = regionW / 2;
    const centerY = regionH / 2;

    // Size tolerance: detected box should be 50%–150% of expected size
    const minW = expectedW * 0.5;
    const maxW = expectedW * 1.5;
    const minH = expectedH * 0.5;
    const maxH = expectedH * 1.5;

    let bestRect: Rect | null = null;
    let bestScore = Infinity;
    const allRects: Rect[] = [];

    const approx = new cv.Mat();

    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const perimeter = cv.arcLength(contour, true);
      cv.approxPolyDP(contour, approx, 0.04 * perimeter, true);

      if (approx.rows !== 4 || !cv.isContourConvex(approx)) {
        contour.delete();
        continue;
      }

      const br = cv.boundingRect(contour);
      contour.delete();

      if (br.width < minW || br.width > maxW || br.height < minH || br.height > maxH) {
        continue;
      }

      const r: Rect = { x: br.x, y: br.y, w: br.width, h: br.height };
      allRects.push(r);

      const cx = br.x + br.width / 2;
      const cy = br.y + br.height / 2;
      const distFromCenter = Math.sqrt(
        Math.pow((cx - centerX) / regionW, 2) +
        Math.pow((cy - centerY) / regionH, 2),
      );
      const sizeDev =
        Math.abs(br.width - expectedW) / expectedW +
        Math.abs(br.height - expectedH) / expectedH;

      const score = distFromCenter + sizeDev * 0.5;

      if (score < bestScore) {
        bestScore = score;
        bestRect = r;
      }
    }

    approx.delete();
    return { rect: bestRect, allRects };
  } finally {
    gray.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
  }
}

/** Convert a cv.Mat to ImageData via canvas. */
function matToImageData(cv: CV, mat: CV): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = mat.cols;
  canvas.height = mat.rows;
  cv.imshow(canvas, mat);
  return canvas.getContext('2d')!.getImageData(0, 0, mat.cols, mat.rows);
}

/** Draw debug visualization: all candidate rects (blue) + winner (green) on the search region. */
function createDebugContourImage(
  cv: CV,
  searchRegion: CV,
  allRects: Rect[],
  bestRect: Rect | null,
): ImageData {
  // Convert to color for drawing
  const debug = new cv.Mat();
  if (searchRegion.channels() === 1) {
    cv.cvtColor(searchRegion, debug, cv.COLOR_GRAY2RGBA);
  } else if (searchRegion.channels() === 3) {
    cv.cvtColor(searchRegion, debug, cv.COLOR_RGB2RGBA);
  } else {
    searchRegion.copyTo(debug);
  }

  // Draw all candidate rects in blue
  for (const r of allRects) {
    cv.rectangle(
      debug,
      new cv.Point(r.x, r.y),
      new cv.Point(r.x + r.w, r.y + r.h),
      new cv.Scalar(0, 100, 255, 255), // blue
      1,
    );
  }

  // Draw winner in green, thicker
  if (bestRect) {
    cv.rectangle(
      debug,
      new cv.Point(bestRect.x, bestRect.y),
      new cv.Point(bestRect.x + bestRect.w, bestRect.y + bestRect.h),
      new cv.Scalar(0, 255, 0, 255), // green
      2,
    );
  }

  // Draw crosshair at center (nominal position)
  const cx = Math.round(debug.cols / 2);
  const cy = Math.round(debug.rows / 2);
  cv.line(debug, new cv.Point(cx - 5, cy), new cv.Point(cx + 5, cy), new cv.Scalar(255, 0, 0, 255), 1);
  cv.line(debug, new cv.Point(cx, cy - 5), new cv.Point(cx, cy + 5), new cv.Scalar(255, 0, 0, 255), 1);

  const result = matToImageData(cv, debug);
  debug.delete();
  return result;
}
