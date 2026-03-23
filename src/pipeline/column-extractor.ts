/**
 * Column-based digit box extraction pipeline.
 *
 * Instead of locating each digit box individually from fixed coordinates,
 * this module works top-down:
 * 1. Detect horizontal row boundaries via Hough lines
 * 2. Extract a full table strip (header → nett KG bottom)
 * 3. Find column dividers via Sobel vertical projection + greedy NMS
 * 4. Locate digit boxes within each column using fixed offsets
 *
 * Calibrated constants measured from binary threshold + vertical projection
 * on the rectified 2339×1654 image.
 */

import { preprocessCell, createRedMask, removeRedInk } from './preprocess.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

// --- Calibrated constants (measured from calibrate.html on printed red form) ---
const IMG_W = 2339;
const IMG_H = 1654;

/** Digit box width in pixels */
const BOX_W = 31;
/** Digit box height in pixels */
const BOX_H = 41;
/** Stride between adjacent digit boxes (= BOX_W, shared edges) */
const DIGIT_STRIDE = 31;
/** Gap between d2 right edge and d3 left edge (comma space) */
const DECIMAL_GAP = 10;
/** Full stride across decimal: left-of-d2 → left-of-d3 */
const DECIMAL_STRIDE = BOX_W + DECIMAL_GAP;

const NUM_COLUMNS = 14;
const COLUMN_NAMES = [
  '90L RUC', '7.6L Sharps', '20L Sharps', '25L Sharps',
  '2.5L Specibin', '5L Specibin', '10L Specibin', '20L Specibin',
  '25L Specibin', 'Pharma 5L', 'Pharma 20L', '50L Box', '142L Box', 'Other',
];
const ROW_NAMES = ['received', 'gross_kg', 'nett_kg'];

// --- Types ---

export interface ExtractedDigit {
  cellId: string;
  row: string;
  col: string;
  digitIndex: number;
  isDecimal: boolean;
  fieldId: string;
  /** Raw crop of the digit box */
  imageData: ImageData;
  /** Preprocessed (binarized) digit image */
  preprocessedData: ImageData;
}

export interface PipelineDebug {
  /** Detected row boundaries: [received_top, gross_top, nett_top, nett_bot] */
  rowBounds: number[];
  /** Top of the header row */
  headerTop: number;
  /** Full table strip with column dividers overlaid (ImageData) */
  tableStripImage: ImageData;
  /** Detected column divider x-positions (14 left edges) */
  columnDividers: number[];
  /** Average column width */
  avgColumnWidth: number;
  /** Per-column crop with digit box overlays (colIndex → ImageData) */
  columnCrops: Map<number, ImageData>;
  /** Per-digit raw crop (cellId → ImageData) */
  digitCrops: Map<string, ImageData>;
  /** Per-digit preprocessed (cellId → ImageData) */
  digitPreprocessed: Map<string, ImageData>;
}

export interface ColumnExtractionResult {
  digits: ExtractedDigit[];
  debug: PipelineDebug;
}

// --- Main extraction function ---

export function columnExtract(cv: CV, corrected: CV): ColumnExtractionResult {
  // Step 1: Detect horizontal red lines in the image
  const hLines = detectHorizontalLines(cv, corrected);

  // Step 2: Find row boundaries (4 equally-spaced horizontal lines)
  const rowBounds = findRowBoundaries(hLines);

  // Step 3: Find header top (line above first row boundary)
  const headerTop = findHeaderTop(hLines, rowBounds);

  // Step 4: Find column dividers using red mask + horizontal erosion
  const tableTop = headerTop;
  const tableBot = rowBounds[3];
  const { dividers, tableStripImage } = findColumnDividers(cv, corrected, tableTop, tableBot);

    const avgColWidth = Math.round(
      dividers.slice(1).reduce((sum: number, d: number, i: number) => sum + (d - dividers[i]), 0) / (dividers.length - 1),
    );

    // Step 4: Extract digit boxes from each column
    const digits: ExtractedDigit[] = [];
    const columnCrops = new Map<number, ImageData>();
    const digitCrops = new Map<string, ImageData>();
    const digitPreprocessed = new Map<string, ImageData>();

    for (let ci = 0; ci < NUM_COLUMNS; ci++) {
      const colLeft = dividers[ci];
      const colRight = ci < dividers.length - 1
        ? dividers[ci + 1]
        : Math.min(IMG_W, colLeft + avgColWidth);
      const colW = colRight - colLeft;

      // Generate column crop with overlays for debug
      const colCropDebug = createColumnDebugImage(cv, corrected, colLeft, colW, avgColWidth, tableTop, tableBot, rowBounds);
      columnCrops.set(ci, colCropDebug);

      // Extract digit boxes
      // Always use avgColWidth for centering so narrow last column doesn't shift boxes
      for (let ri = 0; ri < 3; ri++) {
        const rowTop = rowBounds[ri];
        const rowBot = rowBounds[ri + 1];
        const rowH = rowBot - rowTop;
        const isKG = ri > 0;
        const nDigits = isKG ? 4 : 3;

        // Compute digit group width
        let groupW: number;
        if (isKG) {
          groupW = 2 * DIGIT_STRIDE + DECIMAL_STRIDE + BOX_W;
        } else {
          groupW = 2 * DIGIT_STRIDE + BOX_W;
        }

        // Center horizontally using avgColWidth (not actual colW)
        const startX = colLeft + (avgColWidth - groupW) / 2;
        const boxY = rowTop + (rowH - BOX_H) / 2;

        let xOff = 0;
        for (let di = 0; di < nDigits; di++) {
          const bx = Math.round(startX + xOff);
          const by = Math.round(boxY);
          const bw = BOX_W;
          const bh = BOX_H;

          // Clamp to image bounds
          const cx = Math.max(0, Math.min(bx, IMG_W - bw));
          const cy = Math.max(0, Math.min(by, IMG_H - bh));

          const col = COLUMN_NAMES[ci];
          const row = ROW_NAMES[ri];
          const fieldId = `${row}_${col.replace(/[\s.]/g, '_')}`;
          const cellId = `${fieldId}_d${di}`;

          // Crop digit from corrected image
          const digitROI = corrected.roi(new cv.Rect(cx, cy, bw, bh));
          const digitImageData = matToImageData(cv, digitROI);

          // Remove red ink (form lines) then preprocess
          const noRed = removeRedInk(cv, digitROI);
          const preprocessed = preprocessCell(cv, noRed);
          noRed.delete();
          const ppImageData = matToImageData(cv, preprocessed);
          preprocessed.delete();
          digitROI.delete();

          const digit: ExtractedDigit = {
            cellId,
            row,
            col,
            digitIndex: di,
            isDecimal: isKG && di >= 3,
            fieldId,
            imageData: digitImageData,
            preprocessedData: ppImageData,
          };
          digits.push(digit);
          digitCrops.set(cellId, digitImageData);
          digitPreprocessed.set(cellId, ppImageData);

          // Advance x
          if (isKG && di === 2) {
            xOff += DECIMAL_STRIDE;
          } else {
            xOff += DIGIT_STRIDE;
          }
        }
      }
    }

    return {
      digits,
      debug: {
        rowBounds,
        headerTop,
        tableStripImage,
        columnDividers: dividers,
        avgColumnWidth: avgColWidth,
        columnCrops,
        digitCrops,
        digitPreprocessed,
      },
    };
}

// --- Horizontal line detection using red mask ---

/**
 * Detect y-positions of horizontal red lines in the image.
 * Uses morphological opening with a wide horizontal kernel to
 * isolate lines that span significant width, then horizontal
 * projection to find their y-positions.
 */
function detectHorizontalLines(cv: CV, corrected: CV): number[] {
  const redMask = createRedMask(cv, corrected);

  // Morphological opening: keep only features spanning ≥200px horizontally
  const hKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(200, 1));
  const hLines = new cv.Mat();
  cv.morphologyEx(redMask, hLines, cv.MORPH_OPEN, hKernel);
  hKernel.delete();
  redMask.delete();

  // Horizontal projection (count red pixels per row)
  const rows = corrected.rows;
  const cols = corrected.cols;
  const profile = new Float64Array(rows);
  for (let y = 0; y < rows; y++) {
    let sum = 0;
    for (let x = 0; x < cols; x++) sum += hLines.ucharAt(y, x);
    profile[y] = sum / 255;
  }
  hLines.delete();

  // Find peaks
  const maxVal = Math.max(...Array.from(profile));
  if (maxVal === 0) return [];
  const threshold = maxVal * 0.3;

  const peaks: { y: number; strength: number }[] = [];
  for (let y = 1; y < rows - 1; y++) {
    if (profile[y] > threshold &&
        profile[y] >= profile[y - 1] && profile[y] >= profile[y + 1]) {
      peaks.push({ y, strength: profile[y] });
    }
  }

  // NMS with 10px spacing
  peaks.sort((a, b) => b.strength - a.strength);
  const selected: number[] = [];
  for (const p of peaks) {
    if (!selected.some(s => Math.abs(s - p.y) < 10)) {
      selected.push(p.y);
    }
  }
  selected.sort((a, b) => a - b);

  return selected;
}

// --- Row boundary detection ---

function findRowBoundaries(lineYs: number[]): number[] {
  // Find best 4 equally-spaced horizontal lines (table row dividers)
  let bestMatch: number[] | null = null;
  let bestScore = Infinity;

  for (let a = 0; a < lineYs.length; a++) {
    for (let b = a + 1; b < lineYs.length; b++) {
      const h0 = lineYs[b] - lineYs[a];
      if (h0 < 30 || h0 > 120) continue;
      for (let c = b + 1; c < lineYs.length; c++) {
        const h1 = lineYs[c] - lineYs[b];
        if (h1 < 30 || h1 > 120) continue;
        for (let d = c + 1; d < lineYs.length; d++) {
          const h2 = lineYs[d] - lineYs[c];
          if (h2 < 30 || h2 > 120) continue;
          const avgH = (h0 + h1 + h2) / 3;
          const heightVar = Math.abs(h0 - avgH) + Math.abs(h1 - avgH) + Math.abs(h2 - avgH);
          if (heightVar < bestScore) {
            bestScore = heightVar;
            bestMatch = [lineYs[a], lineYs[b], lineYs[c], lineYs[d]];
          }
        }
      }
    }
  }

  if (!bestMatch) {
    throw new Error('Could not detect row boundaries in form image');
  }
  return bestMatch;
}

function findHeaderTop(lineYs: number[], rowBounds: number[]): number {
  // Find the horizontal line closest above the first row boundary
  const candidates = lineYs.filter(y => y < rowBounds[0] && y > rowBounds[0] - 150);
  if (candidates.length > 0) {
    return candidates[candidates.length - 1]; // closest to rowBounds[0]
  }
  return rowBounds[0] - 57; // fallback
}

// --- Column divider detection using red mask + horizontal erosion ---

function findColumnDividers(
  cv: CV,
  corrected: CV,
  tableTop: number,
  tableBot: number,
): { dividers: number[]; tableStripImage: ImageData } {
  const tableH = tableBot - tableTop;

  // Create red mask of the table strip
  const tableStrip = corrected.roi(new cv.Rect(0, tableTop, corrected.cols, tableH));
  const redMask = createRedMask(cv, tableStrip);
  tableStrip.delete();

  // Horizontal erosion: removes vertical features ≤ 2px wide (digit box edges ~0.7px)
  // while preserving column dividers (~4px wide)
  const hKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 1));
  const eroded = new cv.Mat();
  cv.erode(redMask, eroded, hKernel);
  hKernel.delete();
  redMask.delete();

  // Vertical projection (sum each column)
  const profile = new Float64Array(corrected.cols);
  for (let x = 0; x < corrected.cols; x++) {
    let sum = 0;
    for (let y = 0; y < tableH; y++) sum += eroded.ucharAt(y, x);
    profile[x] = sum / 255;
  }
  eroded.delete();

  // Gaussian blur σ=3
  const blurred = new Float64Array(corrected.cols);
  const sigma = 3, kHalf = 7;
  const kernel: number[] = [];
  let kSum = 0;
  for (let i = -kHalf; i <= kHalf; i++) {
    const v = Math.exp(-i * i / (2 * sigma * sigma));
    kernel.push(v);
    kSum += v;
  }
  for (let i = 0; i < kernel.length; i++) kernel[i] /= kSum;
  for (let x = 0; x < corrected.cols; x++) {
    let val = 0;
    for (let k = 0; k < kernel.length; k++) {
      const xi = Math.max(0, Math.min(corrected.cols - 1, x + k - kHalf));
      val += profile[xi] * kernel[k];
    }
    blurred[x] = val;
  }

  // Find local maxima above 35% threshold
  const maxVal = Math.max(...Array.from(blurred));
  const highThreshold = maxVal * 0.35;
  const allPeaks: { x: number; strength: number }[] = [];
  for (let x = 2; x < corrected.cols - 2; x++) {
    if (blurred[x] > highThreshold &&
        blurred[x] > blurred[x - 1] && blurred[x] > blurred[x + 1] &&
        blurred[x] > blurred[x - 2] && blurred[x] > blurred[x + 2]) {
      allPeaks.push({ x, strength: blurred[x] });
    }
  }
  allPeaks.sort((a, b) => b.strength - a.strength);

  // Greedy NMS with 80px min spacing
  const selected: { x: number; strength: number }[] = [];
  for (const p of allPeaks) {
    if (!selected.some(s => Math.abs(s.x - p.x) < 80)) {
      selected.push(p);
    }
  }
  selected.sort((a, b) => a.x - b.x);

  // Find median spacing among adjacent peaks (filter for plausible column widths)
  const adjSpacings: number[] = [];
  for (let i = 1; i < selected.length; i++) {
    adjSpacings.push(selected[i].x - selected[i - 1].x);
  }
  const goodSpacings = adjSpacings.filter(s => s >= 100 && s <= 250);
  goodSpacings.sort((a, b) => a - b);
  const medianSpacing = goodSpacings.length > 0
    ? goodSpacings[Math.floor(goodSpacings.length / 2)]
    : 157; // fallback

  // Build longest chain of peaks following consistent spacing.
  // This skips table edges and row header dividers (which break the pattern).
  let bestChain: number[] = [];
  for (let start = 0; start < selected.length; start++) {
    const chain = [selected[start].x];
    for (let i = start + 1; i < selected.length; i++) {
      const expected = chain[chain.length - 1] + medianSpacing;
      if (Math.abs(selected[i].x - expected) < medianSpacing * 0.3) {
        chain.push(selected[i].x);
      }
    }
    if (chain.length > bestChain.length) {
      bestChain = chain;
    }
  }

  // Refine spacing from the chain
  let refinedSpacing = medianSpacing;
  if (bestChain.length > 1) {
    const chainSpacings: number[] = [];
    for (let i = 1; i < bestChain.length; i++) chainSpacings.push(bestChain[i] - bestChain[i - 1]);
    refinedSpacing = chainSpacings.reduce((a, b) => a + b, 0) / chainSpacings.length;
  }

  // Extrapolate to 15 dividers if chain is shorter
  while (bestChain.length < 15) {
    const nextX = bestChain[bestChain.length - 1] + refinedSpacing;
    if (nextX < corrected.cols - 10) {
      bestChain.push(Math.round(nextX));
    } else {
      // Extend left
      const prevX = bestChain[0] - refinedSpacing;
      if (prevX >= 10) {
        bestChain.unshift(Math.round(prevX));
      } else {
        break;
      }
    }
  }

  // Take first 14 as column left edges (15th is right edge of last column)
  const dividers = bestChain.slice(0, Math.min(14, bestChain.length));

  // Create debug visualization
  const tableStripColor = corrected.roi(new cv.Rect(0, tableTop, corrected.cols, tableH));
  const vis = new cv.Mat();
  tableStripColor.copyTo(vis);
  tableStripColor.delete();

  for (const d of dividers) {
    cv.line(vis, new cv.Point(d, 0), new cv.Point(d, tableH), new cv.Scalar(0, 255, 0, 255), 2);
  }
  const tableStripImage = matToImageData(cv, vis);
  vis.delete();

  return { dividers, tableStripImage };
}

// --- Column debug image ---

function createColumnDebugImage(
  cv: CV,
  corrected: CV,
  colLeft: number,
  colW: number,
  avgColWidth: number,
  tableTop: number,
  tableBot: number,
  rowBounds: number[],
): ImageData {
  const colH = tableBot - tableTop;
  const clampedW = Math.min(colW, IMG_W - colLeft);

  // If the crop is narrower than avgColWidth, pad with white to maintain consistent sizing
  const targetW = Math.max(clampedW, avgColWidth);
  const colROI = corrected.roi(new cv.Rect(Math.round(colLeft), tableTop, Math.round(clampedW), colH));
  let vis: CV;
  if (clampedW < avgColWidth) {
    vis = new cv.Mat(colH, targetW, corrected.type(), new cv.Scalar(255, 255, 255, 255));
    const destROI = vis.roi(new cv.Rect(0, 0, clampedW, colH));
    colROI.copyTo(destROI);
    destROI.delete();
  } else {
    vis = new cv.Mat();
    colROI.copyTo(vis);
  }
  colROI.delete();

  // Draw row boundaries as cyan lines
  for (const ry of rowBounds) {
    const localY = ry - tableTop;
    cv.line(vis, new cv.Point(0, localY), new cv.Point(targetW, localY),
      new cv.Scalar(0, 255, 255, 255), 1);
  }

  // Draw digit box overlays — use avgColWidth for centering
  for (let ri = 0; ri < 3; ri++) {
    const rowTop = rowBounds[ri] - tableTop;
    const rowBot = rowBounds[ri + 1] - tableTop;
    const rowH = rowBot - rowTop;
    const isKG = ri > 0;
    const nDigits = isKG ? 4 : 3;

    let groupW: number;
    if (isKG) {
      groupW = 2 * DIGIT_STRIDE + DECIMAL_STRIDE + BOX_W;
    } else {
      groupW = 2 * DIGIT_STRIDE + BOX_W;
    }
    const startX = (avgColWidth - groupW) / 2;
    const boxY = rowTop + (rowH - BOX_H) / 2;

    let xOff = 0;
    for (let di = 0; di < nDigits; di++) {
      const bx = startX + xOff;
      const color = isKG && di >= 3
        ? new cv.Scalar(255, 165, 0, 255)
        : new cv.Scalar(0, 255, 0, 255);
      cv.rectangle(vis,
        new cv.Point(Math.round(bx), Math.round(boxY)),
        new cv.Point(Math.round(bx + BOX_W), Math.round(boxY + BOX_H)),
        color, 1);

      if (isKG && di === 2) {
        xOff += DECIMAL_STRIDE;
      } else {
        xOff += DIGIT_STRIDE;
      }
    }
  }

  const result = matToImageData(cv, vis);
  vis.delete();
  return result;
}

// --- Utility ---

function matToImageData(cv: CV, mat: CV): ImageData {
  // Always clone to a new continuous mat to handle ROI submats correctly
  // (ROI .data returns garbled data because of stride/offset into parent buffer)
  const continuous = new cv.Mat();
  if (mat.channels() === 1) {
    cv.cvtColor(mat, continuous, cv.COLOR_GRAY2RGBA);
  } else if (mat.channels() === 3) {
    cv.cvtColor(mat, continuous, cv.COLOR_RGB2RGBA);
  } else {
    mat.copyTo(continuous);
  }
  // Copy pixel data out of the WASM heap before deleting the mat
  const data = new ImageData(
    new Uint8ClampedArray(continuous.data.slice()),
    continuous.cols,
    continuous.rows,
  );
  continuous.delete();
  return data;
}
