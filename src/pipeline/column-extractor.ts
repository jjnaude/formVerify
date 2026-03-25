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
 * on the rectified 2339x1654 image.
 */

import { preprocessCell } from './preprocess.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

// --- Calibrated constants (measured from actual printed form) ---
const IMG_W = 2339;
const IMG_H = 1654;

/** Digit box width in pixels */
const BOX_W = 34;
/** Digit box height in pixels */
const BOX_H = Math.round(0.0308 * IMG_H); // ~51px
/** Stride between adjacent digit boxes (boxes touch, no gap) */
const DIGIT_STRIDE = 34;
/** Gap between d2 right edge and d3 left edge (comma space) */
const DECIMAL_GAP = 11;
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
  const gray = new cv.Mat();
  cv.cvtColor(corrected, gray, cv.COLOR_RGBA2GRAY);

  try {
    // Step 1: Find row boundaries
    const rowBounds = findRowBoundaries(cv, gray);

    // Step 2: Find header top
    const headerTop = findHeaderTop(cv, gray, rowBounds);

    // Step 3: Find column dividers using full table strip
    const tableTop = headerTop;
    const tableBot = rowBounds[3];
    const { dividers, tableStripImage } = findColumnDividers(cv, gray, corrected, tableTop, tableBot);

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

          // Preprocess
          const preprocessed = preprocessCell(cv, digitROI);
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
  } finally {
    gray.delete();
  }
}

// --- Row boundary detection ---

function findRowBoundaries(cv: CV, gray: CV): number[] {
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  const hough = new cv.Mat();
  cv.HoughLinesP(edges, hough, 1, Math.PI / 180, 40, 40, 3);

  const hYs: number[] = [];
  for (let i = 0; i < hough.rows; i++) {
    const x1 = hough.intAt(i, 0), y1 = hough.intAt(i, 1);
    const x2 = hough.intAt(i, 2), y2 = hough.intAt(i, 3);
    const angle = Math.abs(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
    if (angle < 3 || angle > 177) hYs.push((y1 + y2) / 2);
  }
  hough.delete();
  edges.delete();

  hYs.sort((a, b) => a - b);
  const clusters: number[][] = [];
  let cl = [hYs[0]];
  for (let i = 1; i < hYs.length; i++) {
    if (hYs[i] - hYs[i - 1] < 10) cl.push(hYs[i]);
    else { clusters.push(cl); cl = [hYs[i]]; }
  }
  clusters.push(cl);
  const clusterCenters = clusters.map(c => Math.round(c.reduce((a, b) => a + b, 0) / c.length));

  // Find 4 boundaries with equal-spacing constraint
  const tableClusters = clusterCenters.filter(y => y > 150 && y < 500);
  let bestMatch: number[] | null = null;
  let bestScore = Infinity;

  for (let a = 0; a < tableClusters.length; a++) {
    for (let b = a + 1; b < tableClusters.length; b++) {
      const h0 = tableClusters[b] - tableClusters[a];
      if (h0 < 40 || h0 > 80) continue;
      for (let c = b + 1; c < tableClusters.length; c++) {
        const h1 = tableClusters[c] - tableClusters[b];
        if (h1 < 40 || h1 > 80) continue;
        for (let d = c + 1; d < tableClusters.length; d++) {
          const h2 = tableClusters[d] - tableClusters[c];
          if (h2 < 40 || h2 > 80) continue;
          const avgH = (h0 + h1 + h2) / 3;
          const heightVar = Math.abs(h0 - avgH) + Math.abs(h1 - avgH) + Math.abs(h2 - avgH);
          const centerY = (tableClusters[a] + tableClusters[d]) / 2;
          const expectedCenter = (0.1485 + 0.2145) / 2 * IMG_H + (0.0308 * IMG_H) / 2;
          const score = heightVar + Math.abs(centerY - expectedCenter) * 0.5;
          if (score < bestScore) {
            bestScore = score;
            bestMatch = [tableClusters[a], tableClusters[b], tableClusters[c], tableClusters[d]];
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

function findHeaderTop(cv: CV, gray: CV, rowBounds: number[]): number {
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  const hough = new cv.Mat();
  cv.HoughLinesP(edges, hough, 1, Math.PI / 180, 40, 40, 3);

  const hYs: number[] = [];
  for (let i = 0; i < hough.rows; i++) {
    const x1 = hough.intAt(i, 0), y1 = hough.intAt(i, 1);
    const x2 = hough.intAt(i, 2), y2 = hough.intAt(i, 3);
    const angle = Math.abs(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
    if (angle < 3 || angle > 177) hYs.push((y1 + y2) / 2);
  }
  hough.delete();
  edges.delete();

  hYs.sort((a, b) => a - b);
  const clusters: number[][] = [];
  let cl = [hYs[0]];
  for (let i = 1; i < hYs.length; i++) {
    if (hYs[i] - hYs[i - 1] < 10) cl.push(hYs[i]);
    else { clusters.push(cl); cl = [hYs[i]]; }
  }
  clusters.push(cl);
  const centers = clusters.map(c => Math.round(c.reduce((a, b) => a + b, 0) / c.length));

  const candidates = centers.filter(y => y < rowBounds[0] && y > rowBounds[0] - 100);
  return candidates.length > 0 ? candidates[0] : rowBounds[0] - 57;
}

// --- Column divider detection ---

function findColumnDividers(
  cv: CV,
  gray: CV,
  corrected: CV,
  tableTop: number,
  tableBot: number,
): { dividers: number[]; tableStripImage: ImageData } {
  const tableH = tableBot - tableTop;
  const tableStrip = gray.roi(new cv.Rect(0, tableTop, gray.cols, tableH));

  // Sobel |dI/dx|
  const sobelX = new cv.Mat();
  cv.Sobel(tableStrip, sobelX, cv.CV_32F, 1, 0, 3);
  const absSobel = new cv.Mat();
  cv.convertScaleAbs(sobelX, absSobel);
  sobelX.delete();

  // Sum vertically
  const profile = new Float64Array(gray.cols);
  for (let x = 0; x < gray.cols; x++) {
    let sum = 0;
    for (let y = 0; y < tableH; y++) sum += absSobel.ucharAt(y, x);
    profile[x] = sum;
  }
  absSobel.delete();

  // Gaussian blur σ=3
  const blurred = new Float64Array(gray.cols);
  const sigma = 3, kHalf = 7;
  const kernel: number[] = [];
  let kSum = 0;
  for (let i = -kHalf; i <= kHalf; i++) {
    const v = Math.exp(-i * i / (2 * sigma * sigma));
    kernel.push(v);
    kSum += v;
  }
  for (let i = 0; i < kernel.length; i++) kernel[i] /= kSum;
  for (let x = 0; x < gray.cols; x++) {
    let val = 0;
    for (let k = 0; k < kernel.length; k++) {
      const xi = Math.max(0, Math.min(gray.cols - 1, x + k - kHalf));
      val += profile[xi] * kernel[k];
    }
    blurred[x] = val;
  }

  // Find local maxima above 35% threshold
  const maxVal = Math.max(...Array.from(blurred));
  const highThreshold = maxVal * 0.35;
  const allPeaks: { x: number; strength: number }[] = [];
  for (let x = 2; x < gray.cols - 2; x++) {
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

  // Find best run of 15 equally-spaced dividers
  let bestRun: number[] | null = null;
  let bestRunVar = Infinity;
  for (let start = 0; start <= selected.length - 15; start++) {
    const runDivs = selected.slice(start, start + 15).map(s => s.x);
    const runSpacings: number[] = [];
    for (let i = 1; i < runDivs.length; i++) runSpacings.push(runDivs[i] - runDivs[i - 1]);
    const avg = runSpacings.reduce((a, b) => a + b, 0) / runSpacings.length;
    const variance = runSpacings.reduce((a, s) => a + (s - avg) ** 2, 0) / runSpacings.length;
    if (variance < bestRunVar) {
      bestRunVar = variance;
      bestRun = runDivs;
    }
  }

  // Take first 14 as column left edges
  const dividers = bestRun ? bestRun.slice(0, 14) : selected.slice(0, 14).map(s => s.x);

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
  tableStrip.delete();

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
