/**
 * ArUco marker detector using OpenCV.js image processing
 * and custom DICT_4X4_50 bit-pattern matching.
 *
 * Pipeline:
 * 1. Convert to grayscale
 * 2. Adaptive threshold
 * 3. Find contours
 * 4. Filter for quadrilateral contours
 * 5. For each quad: perspective-correct to canonical view, read 4×4 bits
 * 6. Match bits against DICT_4X4_50 dictionary
 */

import { matchMarker } from './aruco-dict.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

export interface DetectedMarker {
  id: number;
  /** Four corners in image coordinates, ordered: TL, TR, BR, BL after rotation correction. */
  corners: [Point, Point, Point, Point];
}

export interface Point {
  x: number;
  y: number;
}

/** Minimum perimeter (pixels) to consider a contour as a marker candidate. */
const MIN_PERIMETER = 60;
/** Maximum cosine of angle between edges for a convex quadrilateral. */
const MAX_COS_ANGLE = 0.3;
/** Canonical marker size for bit sampling (pixels). */
const CANONICAL_SIZE = 42; // 6 cells × 7px each

/**
 * Detect ArUco DICT_4X4_50 markers (IDs 0–3) in an image.
 *
 * @param cv - OpenCV.js module
 * @param src - Source image as cv.Mat (any color format)
 * @returns Array of detected markers with their IDs and corner positions
 */
export function detectMarkers(cv: CV, src: CV): DetectedMarker[] {
  const gray = new cv.Mat();
  const thresh = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    // 1. Grayscale
    if (src.channels() === 4) {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    } else if (src.channels() === 3) {
      cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
    } else {
      src.copyTo(gray);
    }

    // 2. Adaptive threshold
    cv.adaptiveThreshold(
      gray,
      thresh,
      255,
      cv.ADAPTIVE_THRESH_MEAN_C,
      cv.THRESH_BINARY_INV,
      Math.max(3, Math.round(gray.cols / 80) | 1), // block size, must be odd
      7,
    );

    // 3. Find contours
    cv.findContours(
      thresh,
      contours,
      hierarchy,
      cv.RETR_LIST,
      cv.CHAIN_APPROX_SIMPLE,
    );

    const markers: DetectedMarker[] = [];
    const approx = new cv.Mat();

    try {
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const perimeter = cv.arcLength(contour, true);

        if (perimeter < MIN_PERIMETER) {
          contour.delete();
          continue;
        }

        // 4. Approximate polygon
        cv.approxPolyDP(contour, approx, 0.03 * perimeter, true);
        contour.delete();

        if (approx.rows !== 4) continue;
        if (!cv.isContourConvex(approx)) continue;

        // Check angles aren't too sharp
        const corners = getCornerPoints(approx);
        if (!hasReasonableAngles(corners)) continue;

        // 5. Perspective-correct to canonical view and read bits
        const marker = identifyMarker(cv, gray, corners);
        if (marker) {
          markers.push(marker);
        }
      }
    } finally {
      approx.delete();
    }

    // De-duplicate: if multiple detections for same ID, keep the one with larger perimeter
    return deduplicateMarkers(markers);
  } finally {
    gray.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
  }
}

function getCornerPoints(approx: CV): [Point, Point, Point, Point] {
  const pts: Point[] = [];
  for (let j = 0; j < 4; j++) {
    pts.push({
      x: approx.intAt(j, 0),
      y: approx.intAt(j, 1),
    });
  }
  // Order corners: start from top-left, clockwise
  return orderCorners(pts) as [Point, Point, Point, Point];
}

function orderCorners(pts: Point[]): Point[] {
  // Sum x+y: smallest = TL, largest = BR
  // Diff x-y: smallest = BL, largest = TR
  const sorted = [...pts];
  const sums = sorted.map((p) => p.x + p.y);
  const diffs = sorted.map((p) => p.x - p.y);

  const tl = sorted[sums.indexOf(Math.min(...sums))];
  const br = sorted[sums.indexOf(Math.max(...sums))];
  const tr = sorted[diffs.indexOf(Math.max(...diffs))];
  const bl = sorted[diffs.indexOf(Math.min(...diffs))];

  return [tl, tr, br, bl];
}

function hasReasonableAngles(corners: Point[]): boolean {
  for (let i = 0; i < 4; i++) {
    const p0 = corners[i];
    const p1 = corners[(i + 1) % 4];
    const p2 = corners[(i + 2) % 4];
    const cos = cosAngle(p0, p1, p2);
    if (Math.abs(cos) > MAX_COS_ANGLE) return false;
  }
  return true;
}

function cosAngle(p0: Point, p1: Point, p2: Point): number {
  const d1x = p0.x - p1.x;
  const d1y = p0.y - p1.y;
  const d2x = p2.x - p1.x;
  const d2y = p2.y - p1.y;
  return (
    (d1x * d2x + d1y * d2y) /
    (Math.sqrt(d1x * d1x + d1y * d1y) * Math.sqrt(d2x * d2x + d2y * d2y) + 1e-10)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function identifyMarker(cv: CV, gray: any, corners: [Point, Point, Point, Point]): DetectedMarker | null {
  const size = CANONICAL_SIZE;
  const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    corners[0].x, corners[0].y,
    corners[1].x, corners[1].y,
    corners[2].x, corners[2].y,
    corners[3].x, corners[3].y,
  ]);
  const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0, 0,
    size, 0,
    size, size,
    0, size,
  ]);

  const M = cv.getPerspectiveTransform(srcPts, dstPts);
  const canonical = new cv.Mat();

  try {
    cv.warpPerspective(gray, canonical, M, new cv.Size(size, size));

    // Otsu threshold on the warped patch
    const binPatch = new cv.Mat();
    try {
      cv.threshold(canonical, binPatch, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

      // Read the 6×6 grid (border + 4×4 data)
      const cellW = size / 6;
      const cellH = size / 6;

      // Check border cells are black (value 0 after BINARY threshold)
      if (!checkBorder(binPatch, cellW, cellH)) return null;

      // Read inner 4×4 data bits
      const bits: number[] = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const cx = Math.round((c + 1.5) * cellW);
          const cy = Math.round((r + 1.5) * cellH);
          // Sample center of cell
          const val = binPatch.ucharAt(cy, cx);
          bits.push(val > 127 ? 1 : 0);
        }
      }

      const match = matchMarker(bits);
      if (!match) return null;

      // Rotate corners to match the canonical orientation
      const rotatedCorners = rotateCorners(corners, match.rotation);
      return { id: match.id, corners: rotatedCorners };
    } finally {
      binPatch.delete();
    }
  } finally {
    srcPts.delete();
    dstPts.delete();
    M.delete();
    canonical.delete();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkBorder(bin: any, cellW: number, cellH: number): boolean {
  // Check that border cells are mostly black
  const size = 6;
  for (let i = 0; i < size; i++) {
    // Top and bottom rows
    for (const row of [0, size - 1]) {
      const cx = Math.round((i + 0.5) * cellW);
      const cy = Math.round((row + 0.5) * cellH);
      if (bin.ucharAt(cy, cx) > 127) return false;
    }
    // Left and right columns (skip corners already checked)
    if (i > 0 && i < size - 1) {
      for (const col of [0, size - 1]) {
        const cx = Math.round((col + 0.5) * cellW);
        const cy = Math.round((i + 0.5) * cellH);
        if (bin.ucharAt(cy, cx) > 127) return false;
      }
    }
  }
  return true;
}

function rotateCorners(
  corners: [Point, Point, Point, Point],
  rotation: number,
): [Point, Point, Point, Point] {
  // Rotate the corner assignment to align with the canonical marker orientation.
  // rotation = number of 90° CW rotations that were applied to the bits to match.
  // We rotate the corners array in the opposite direction.
  const out = [...corners] as [Point, Point, Point, Point];
  for (let i = 0; i < rotation; i++) {
    const last = out.pop()!;
    out.unshift(last);
  }
  return out;
}

function deduplicateMarkers(markers: DetectedMarker[]): DetectedMarker[] {
  const byId = new Map<number, DetectedMarker>();
  for (const m of markers) {
    const existing = byId.get(m.id);
    if (!existing || markerArea(m) > markerArea(existing)) {
      byId.set(m.id, m);
    }
  }
  return Array.from(byId.values());
}

function markerArea(m: DetectedMarker): number {
  const [a, b, c, d] = m.corners;
  // Shoelace formula for quadrilateral area
  return 0.5 * Math.abs(
    (a.x * b.y - b.x * a.y) +
    (b.x * c.y - c.x * b.y) +
    (c.x * d.y - d.x * c.y) +
    (d.x * a.y - a.x * d.y),
  );
}
