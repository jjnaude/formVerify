/**
 * Hough-transform-based digit box localization.
 *
 * Instead of relying on nominal coordinates extrapolated from calibration,
 * this module finds the actual printed box positions using:
 * 1. Canny edge detection on the corrected grayscale image
 * 2. Hough line detection (retaining only near-horizontal/vertical lines)
 * 3. Matched-filter search: find pairs of horizontal lines with the right
 *    spacing near the expected y, and pairs of vertical lines with the
 *    right spacing near the expected x
 * 4. Iterative refinement: use the ACTUAL position of box N to predict
 *    the position of box N+1, preventing drift accumulation
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

export interface LocatedBox {
  /** Center x in pixels */
  cx: number;
  /** Center y in pixels */
  cy: number;
  /** Detected left edge */
  left: number;
  /** Detected right edge */
  right: number;
  /** Detected top edge */
  top: number;
  /** Detected bottom edge */
  bottom: number;
  /** Width in pixels */
  w: number;
  /** Height in pixels */
  h: number;
  /** Whether this box was found via Hough (true) or fallback (false) */
  found: boolean;
}

export interface HoughDebugInfo {
  /** Canny edges overlaid on grayscale image (for the full form) */
  edgesImage?: ImageData;
  /** Hough lines overlaid on grayscale (for the full form) */
  linesImage?: ImageData;
  /** Per-box debug: search region with detected line pairs */
  boxDebug: Map<string, ImageData>;
}

/** Angle tolerance for "horizontal" and "vertical" lines (degrees). */
const ANGLE_TOLERANCE = 3;

/** How far from the expected position to search for lines (pixels). */
const LINE_SEARCH_RADIUS = 30;

/** Tolerance for matching line-pair spacing to expected box size (fraction). */
const SPACING_TOLERANCE = 0.4;

/**
 * Locate all digit boxes in the corrected image using Hough lines.
 *
 * @param cv OpenCV module
 * @param corrected Perspective-corrected image (cv.Mat)
 * @param boxDefs Array of { id, cx, cy, w, h } with nominal positions in pixels
 * @param expectedBoxW Expected box width in pixels
 * @param expectedBoxH Expected box height in pixels
 * @param strideX Expected horizontal stride between consecutive boxes in pixels
 * @returns Map of box ID → LocatedBox
 */
export function locateBoxes(
  cv: CV,
  corrected: CV,
  boxDefs: { id: string; cx: number; cy: number; row: number; col: number; digitIndex: number }[],
  expectedBoxW: number,
  expectedBoxH: number,
  _strideX: number,
  debug?: HoughDebugInfo,
): Map<string, LocatedBox> {
  const imgW = corrected.cols;
  const imgH = corrected.rows;

  // 1. Grayscale
  const gray = new cv.Mat();
  if (corrected.channels() === 4) {
    cv.cvtColor(corrected, gray, cv.COLOR_RGBA2GRAY);
  } else if (corrected.channels() === 3) {
    cv.cvtColor(corrected, gray, cv.COLOR_RGB2GRAY);
  } else {
    corrected.copyTo(gray);
  }

  // 2. Canny edge detection
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  // 3. Hough line detection — two passes with different thresholds
  // Horizontal: stricter (minLineLength=40) — grid lines are long, rejects handwriting
  const houghH = new cv.Mat();
  cv.HoughLinesP(edges, houghH, 1, Math.PI / 180, 40, 40, 3);

  // Vertical: relaxed (minLineLength=25) — box side borders are shorter
  const houghV = new cv.Mat();
  cv.HoughLinesP(edges, houghV, 1, Math.PI / 180, 20, 25, 3);

  // 4. Classify lines as horizontal or vertical
  const hLines: { y: number; x1: number; x2: number }[] = [];
  const vLines: { x: number; y1: number; y2: number }[] = [];

  for (let i = 0; i < houghH.rows; i++) {
    const x1 = houghH.intAt(i, 0), y1 = houghH.intAt(i, 1);
    const x2 = houghH.intAt(i, 2), y2 = houghH.intAt(i, 3);
    const angle = Math.abs(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
    if (angle < ANGLE_TOLERANCE || angle > 180 - ANGLE_TOLERANCE) {
      hLines.push({ y: (y1 + y2) / 2, x1: Math.min(x1, x2), x2: Math.max(x1, x2) });
    }
  }

  for (let i = 0; i < houghV.rows; i++) {
    const x1 = houghV.intAt(i, 0), y1 = houghV.intAt(i, 1);
    const x2 = houghV.intAt(i, 2), y2 = houghV.intAt(i, 3);
    const angle = Math.abs(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
    if (Math.abs(angle - 90) < ANGLE_TOLERANCE) {
      vLines.push({ x: (x1 + x2) / 2, y1: Math.min(y1, y2), y2: Math.max(y1, y2) });
    }
  }

  // Generate debug images if requested
  if (debug) {
    // Draw Hough lines on copy of grayscale
    const linesVis = new cv.Mat();
    cv.cvtColor(gray, linesVis, cv.COLOR_GRAY2RGBA);
    for (const h of hLines) {
      cv.line(linesVis, new cv.Point(h.x1, Math.round(h.y)), new cv.Point(h.x2, Math.round(h.y)),
        new cv.Scalar(0, 255, 0, 255), 1);
    }
    for (const v of vLines) {
      cv.line(linesVis, new cv.Point(Math.round(v.x), v.y1), new cv.Point(Math.round(v.x), v.y2),
        new cv.Scalar(255, 0, 0, 255), 1);
    }
    const lc = document.createElement('canvas');
    lc.width = linesVis.cols; lc.height = linesVis.rows;
    cv.imshow(lc, linesVis);
    debug.linesImage = lc.getContext('2d')!.getImageData(0, 0, lc.width, lc.height);
    linesVis.delete();
  }

  houghH.delete();
  houghV.delete();
  edges.delete();
  gray.delete();

  // 5. For each box, find the best matching line pairs
  //    Use iterative refinement: actual position of box N predicts box N+1
  const results = new Map<string, LocatedBox>();

  // Group boxes by row and column for iterative tracking
  const rowGroups = new Map<number, typeof boxDefs>();
  for (const b of boxDefs) {
    if (!rowGroups.has(b.row)) rowGroups.set(b.row, []);
    rowGroups.get(b.row)!.push(b);
  }

  for (const [_rowIdx, rowBoxes] of rowGroups) {
    // Sort by column then digit index
    rowBoxes.sort((a, b) => a.col !== b.col ? a.col - b.col : a.digitIndex - b.digitIndex);

    let driftX = 0; // accumulated x correction
    let driftY = 0; // accumulated y correction

    for (const box of rowBoxes) {
      const searchCX = box.cx + driftX;
      const searchCY = box.cy + driftY;

      const located = findBoxAtPosition(
        searchCX, searchCY,
        expectedBoxW, expectedBoxH,
        hLines, vLines,
        imgW, imgH,
      );

      if (located.found) {
        // Update drift based on actual vs nominal position
        driftX = located.cx - box.cx;
        driftY = located.cy - box.cy;
      }

      results.set(box.id, located);

      // Generate per-box debug if requested
      if (debug) {
        const debugImg = createBoxDebugImage(
          cv, corrected,
          searchCX, searchCY,
          expectedBoxW, expectedBoxH,
          located, hLines, vLines,
        );
        if (debugImg) debug.boxDebug.set(box.id, debugImg);
      }
    }
  }

  return results;
}

/**
 * Find a box at a given position using nearby Hough lines.
 *
 * For horizontal lines: don't require spanning the box center — any horizontal
 * line segment near the expected y is valid (table grid lines may be fragmented
 * into short segments by Hough).
 *
 * For vertical lines: require spanning the box's y range (box side borders
 * should cover the full box height).
 */
function findBoxAtPosition(
  expectedCX: number,
  expectedCY: number,
  expectedW: number,
  expectedH: number,
  hLines: { y: number; x1: number; x2: number }[],
  vLines: { x: number; y1: number; y2: number }[],
  imgW: number,
  imgH: number,
): LocatedBox {
  const halfW = expectedW / 2;
  const halfH = expectedH / 2;

  const expectedTop = expectedCY - halfH;
  const expectedBot = expectedCY + halfH;
  const expectedLeft = expectedCX - halfW;
  const expectedRight = expectedCX + halfW;

  // Horizontal lines: any line near the expected y within a wide x range
  // (don't require spanning the exact box center — grid lines fragment)
  const xRangeMin = expectedCX - expectedW * 3;
  const xRangeMax = expectedCX + expectedW * 3;

  const topCandidates = hLines
    .filter(h => Math.abs(h.y - expectedTop) < LINE_SEARCH_RADIUS &&
                 h.x2 > xRangeMin && h.x1 < xRangeMax)
    .map(h => h.y);

  const botCandidates = hLines
    .filter(h => Math.abs(h.y - expectedBot) < LINE_SEARCH_RADIUS &&
                 h.x2 > xRangeMin && h.x1 < xRangeMax)
    .map(h => h.y);

  // Vertical lines: require spanning the box's y range
  const leftCandidates = vLines
    .filter(v => Math.abs(v.x - expectedLeft) < LINE_SEARCH_RADIUS &&
                 v.y1 < expectedCY && v.y2 > expectedCY)
    .map(v => v.x);

  const rightCandidates = vLines
    .filter(v => Math.abs(v.x - expectedRight) < LINE_SEARCH_RADIUS &&
                 v.y1 < expectedCY && v.y2 > expectedCY)
    .map(v => v.x);

  // Find best pair of horizontal lines with spacing close to expectedH
  let bestTop = expectedTop;
  let bestBot = expectedBot;
  let bestHScore = Infinity;
  let hFound = false;

  for (const t of topCandidates) {
    for (const b of botCandidates) {
      if (b <= t) continue;
      const spacing = b - t;
      const spacingErr = Math.abs(spacing - expectedH) / expectedH;
      if (spacingErr > SPACING_TOLERANCE) continue;
      const centerErr = Math.abs((t + b) / 2 - expectedCY);
      const score = spacingErr + centerErr / expectedH * 0.5;
      if (score < bestHScore) {
        bestHScore = score;
        bestTop = t;
        bestBot = b;
        hFound = true;
      }
    }
  }

  // Find best pair of vertical lines with spacing close to expectedW
  let bestLeft = expectedLeft;
  let bestRight = expectedRight;
  let bestVScore = Infinity;
  let vFound = false;

  for (const l of leftCandidates) {
    for (const r of rightCandidates) {
      if (r <= l) continue;
      const spacing = r - l;
      const spacingErr = Math.abs(spacing - expectedW) / expectedW;
      if (spacingErr > SPACING_TOLERANCE) continue;
      const centerErr = Math.abs((l + r) / 2 - expectedCX);
      const score = spacingErr + centerErr / expectedW * 0.5;
      if (score < bestVScore) {
        bestVScore = score;
        bestLeft = l;
        bestRight = r;
        vFound = true;
      }
    }
  }

  const found = hFound || vFound;
  const top = Math.max(0, Math.round(bestTop));
  const bot = Math.min(imgH - 1, Math.round(bestBot));
  const left = Math.max(0, Math.round(bestLeft));
  const right = Math.min(imgW - 1, Math.round(bestRight));

  return {
    cx: (left + right) / 2,
    cy: (top + bot) / 2,
    left, right, top, bottom: bot,
    w: right - left,
    h: bot - top,
    found,
  };
}

/**
 * Create a debug visualization for a single box.
 */
function createBoxDebugImage(
  cv: CV,
  corrected: CV,
  searchCX: number,
  searchCY: number,
  expectedW: number,
  expectedH: number,
  located: LocatedBox,
  hLines: { y: number; x1: number; x2: number }[],
  vLines: { x: number; y1: number; y2: number }[],
): ImageData | null {
  const margin = Math.max(expectedW, expectedH) * 1.5;
  const sx = Math.max(0, Math.round(searchCX - margin));
  const sy = Math.max(0, Math.round(searchCY - margin));
  const sw = Math.min(Math.round(2 * margin), corrected.cols - sx);
  const sh = Math.min(Math.round(2 * margin), corrected.rows - sy);
  if (sw <= 0 || sh <= 0) return null;

  const roi = corrected.roi(new cv.Rect(sx, sy, sw, sh));
  const vis = new cv.Mat();
  if (roi.channels() === 1) cv.cvtColor(roi, vis, cv.COLOR_GRAY2RGBA);
  else if (roi.channels() === 3) cv.cvtColor(roi, vis, cv.COLOR_RGB2RGBA);
  else roi.copyTo(vis);
  roi.delete();

  // Draw nearby H lines in green
  for (const h of hLines) {
    if (h.y >= sy && h.y < sy + sh && h.x2 > sx && h.x1 < sx + sw) {
      const ly = Math.round(h.y - sy);
      const lx1 = Math.max(0, h.x1 - sx);
      const lx2 = Math.min(sw - 1, h.x2 - sx);
      cv.line(vis, new cv.Point(lx1, ly), new cv.Point(lx2, ly),
        new cv.Scalar(0, 200, 0, 255), 1);
    }
  }

  // Draw nearby V lines in blue
  for (const v of vLines) {
    if (v.x >= sx && v.x < sx + sw && v.y2 > sy && v.y1 < sy + sh) {
      const lx = Math.round(v.x - sx);
      const ly1 = Math.max(0, v.y1 - sy);
      const ly2 = Math.min(sh - 1, v.y2 - sy);
      cv.line(vis, new cv.Point(lx, ly1), new cv.Point(lx, ly2),
        new cv.Scalar(255, 100, 0, 255), 1);
    }
  }

  // Draw detected box in bright green
  if (located.found) {
    const dx = located.left - sx;
    const dy = located.top - sy;
    cv.rectangle(vis,
      new cv.Point(dx, dy),
      new cv.Point(dx + located.w, dy + located.h),
      new cv.Scalar(0, 255, 0, 255), 2);
  }

  // Draw expected position crosshair in red
  const ecx = Math.round(searchCX - sx);
  const ecy = Math.round(searchCY - sy);
  cv.line(vis, new cv.Point(ecx - 8, ecy), new cv.Point(ecx + 8, ecy), new cv.Scalar(255, 0, 0, 255), 1);
  cv.line(vis, new cv.Point(ecx, ecy - 8), new cv.Point(ecx, ecy + 8), new cv.Scalar(255, 0, 0, 255), 1);

  const c = document.createElement('canvas');
  c.width = vis.cols; c.height = vis.rows;
  cv.imshow(c, vis);
  const result = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
  vis.delete();
  return result;
}
