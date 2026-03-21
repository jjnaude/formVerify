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
 * Uses two strategies:
 * 1. Contour detection (for well-defined boxes)
 * 2. Morphological line detection (for faint/broken borders)
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

  try {
    // Grayscale
    if (searchRegion.channels() === 4) {
      cv.cvtColor(searchRegion, gray, cv.COLOR_RGBA2GRAY);
    } else if (searchRegion.channels() === 3) {
      cv.cvtColor(searchRegion, gray, cv.COLOR_RGB2GRAY);
    } else {
      searchRegion.copyTo(gray);
    }

    // Try contour-based detection first
    const contourResult = detectViaContours(cv, gray, expectedW, expectedH);
    if (contourResult.rect) return contourResult;

    // Fallback: morphological line detection
    const lineResult = detectViaLines(cv, gray, expectedW, expectedH);
    return {
      rect: lineResult.rect,
      allRects: [...contourResult.allRects, ...lineResult.allRects],
    };
  } finally {
    gray.delete();
  }
}

/** Strategy 1: Find closed rectangular contours. */
function detectViaContours(
  cv: CV,
  gray: CV,
  expectedW: number,
  expectedH: number,
): DetectionResult {
  const thresh = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    // Try multiple threshold approaches
    const blockSize = Math.max(3, Math.round(gray.cols / 6) | 1);
    cv.adaptiveThreshold(
      gray, thresh, 255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY_INV,
      blockSize, 5,
    );

    // Dilate slightly to close gaps in thin lines
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
    cv.dilate(thresh, thresh, kernel);
    kernel.delete();

    cv.findContours(thresh, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    return scoreRects(cv, contours, gray.cols, gray.rows, expectedW, expectedH);
  } finally {
    thresh.delete();
    contours.delete();
    hierarchy.delete();
  }
}

/** Strategy 2: Detect horizontal/vertical lines via morphology, find box from line intersections. */
function detectViaLines(
  cv: CV,
  gray: CV,
  expectedW: number,
  expectedH: number,
): DetectionResult {
  const binary = new cv.Mat();

  try {
    // Strong threshold to find any dark lines
    cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

    const regionW = gray.cols;
    const regionH = gray.rows;

    // Detect horizontal lines
    const horizKernel = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(Math.max(3, Math.round(expectedW * 0.4)), 1),
    );
    const horizLines = new cv.Mat();
    cv.morphologyEx(binary, horizLines, cv.MORPH_OPEN, horizKernel);
    horizKernel.delete();

    // Detect vertical lines
    const vertKernel = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(1, Math.max(3, Math.round(expectedH * 0.4))),
    );
    const vertLines = new cv.Mat();
    cv.morphologyEx(binary, vertLines, cv.MORPH_OPEN, vertKernel);
    vertKernel.delete();

    // Find horizontal line y-positions (project to column, find peaks)
    const hPositions = findLinePositions(cv, horizLines, 'horizontal');
    const vPositions = findLinePositions(cv, vertLines, 'vertical');

    horizLines.delete();
    vertLines.delete();

    // Find the best box from line intersections
    const centerX = regionW / 2;
    const centerY = regionH / 2;
    const allRects: Rect[] = [];
    let bestRect: Rect | null = null;
    let bestScore = Infinity;

    // Try all combinations of 2 horizontal + 2 vertical lines
    for (let hi = 0; hi < hPositions.length; hi++) {
      for (let hj = hi + 1; hj < hPositions.length; hj++) {
        const top = hPositions[hi];
        const bottom = hPositions[hj];
        const h = bottom - top;
        if (h < expectedH * 0.5 || h > expectedH * 1.5) continue;

        for (let vi = 0; vi < vPositions.length; vi++) {
          for (let vj = vi + 1; vj < vPositions.length; vj++) {
            const left = vPositions[vi];
            const right = vPositions[vj];
            const w = right - left;
            if (w < expectedW * 0.5 || w > expectedW * 1.5) continue;

            const r: Rect = { x: left, y: top, w, h };
            allRects.push(r);

            const cx = left + w / 2;
            const cy = top + h / 2;
            const distFromCenter = Math.sqrt(
              Math.pow((cx - centerX) / regionW, 2) +
              Math.pow((cy - centerY) / regionH, 2),
            );
            const sizeDev =
              Math.abs(w - expectedW) / expectedW +
              Math.abs(h - expectedH) / expectedH;
            const score = distFromCenter + sizeDev * 0.5;

            if (score < bestScore) {
              bestScore = score;
              bestRect = r;
            }
          }
        }
      }
    }

    return { rect: bestRect, allRects };
  } finally {
    binary.delete();
  }
}

/** Find line positions by projecting a binary line image to a 1D profile and finding peaks. */
function findLinePositions(_cv: CV, lineMat: CV, direction: 'horizontal' | 'vertical'): number[] {
  const positions: number[] = [];
  const isHoriz = direction === 'horizontal';
  const len = isHoriz ? lineMat.rows : lineMat.cols;

  // Sum along the other axis
  const profile: number[] = [];
  for (let i = 0; i < len; i++) {
    let sum = 0;
    const span = isHoriz ? lineMat.cols : lineMat.rows;
    for (let j = 0; j < span; j++) {
      const val = isHoriz ? lineMat.ucharAt(i, j) : lineMat.ucharAt(j, i);
      if (val > 127) sum++;
    }
    profile.push(sum);
  }

  // Find peaks (positions where the sum exceeds a threshold)
  const threshold = (isHoriz ? lineMat.cols : lineMat.rows) * 0.15;
  let inPeak = false;
  let peakMax = 0;
  let peakMaxPos = 0;

  for (let i = 0; i < profile.length; i++) {
    if (profile[i] > threshold) {
      if (!inPeak) {
        inPeak = true;
        peakMax = 0;
      }
      if (profile[i] > peakMax) {
        peakMax = profile[i];
        peakMaxPos = i;
      }
    } else if (inPeak) {
      positions.push(peakMaxPos);
      inPeak = false;
    }
  }
  if (inPeak) positions.push(peakMaxPos);

  return positions;
}

/** Score rectangular contours and pick the best match. */
function scoreRects(
  cv: CV,
  contours: CV,
  regionW: number,
  regionH: number,
  expectedW: number,
  expectedH: number,
): DetectionResult {
  const centerX = regionW / 2;
  const centerY = regionH / 2;
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
    cv.approxPolyDP(contour, approx, 0.05 * perimeter, true);

    // Accept 4-sided polygons (don't require strict convexity)
    if (approx.rows < 4 || approx.rows > 6) {
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
