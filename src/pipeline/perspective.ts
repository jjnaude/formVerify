/**
 * Perspective correction: warp a photographed form to a flat A4 image
 * using the 4 detected ArUco marker positions.
 *
 * Marker layout on the form:
 *   ID 0 (TL)  ──────────  ID 1 (TR)
 *     │                       │
 *     │        A4 form        │
 *     │                       │
 *   ID 3 (BL)  ──────────  ID 2 (BR)
 *
 * The marker corners used are the outer corners (farthest from form center):
 *   ID 0 → top-left corner of marker
 *   ID 1 → top-right corner of marker
 *   ID 2 → bottom-right corner of marker
 *   ID 3 → bottom-left corner of marker
 */

import type { DetectedMarker, Point } from './aruco-detector.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

/** A4 landscape at 200 DPI: 2339 × 1654 pixels */
const A4_WIDTH = 2339;
const A4_HEIGHT = 1654;

export interface CorrectionResult {
  /** The orthorectified image as a cv.Mat (caller must delete). */
  corrected: CV;
  width: number;
  height: number;
}

/**
 * Get the outer corner of a marker (the corner farthest from the form center).
 *
 * Marker corners are ordered [TL, TR, BR, BL] after rotation correction.
 * Outer corners by marker position:
 *   ID 0 (form TL) → marker's TL corner (index 0)
 *   ID 1 (form TR) → marker's TR corner (index 1)
 *   ID 2 (form BR) → marker's BR corner (index 2)
 *   ID 3 (form BL) → marker's BL corner (index 3)
 */
function getOuterCorner(marker: DetectedMarker): Point {
  return marker.corners[marker.id];
}

/**
 * Correct the perspective of a form image using 4 ArUco markers.
 *
 * @param cv - OpenCV.js module
 * @param src - Source image as cv.Mat
 * @param markers - Exactly 4 detected markers with IDs 0–3
 * @returns Orthorectified A4 image, or null if markers are insufficient
 */
export function correctPerspective(
  cv: CV,
  src: CV,
  markers: DetectedMarker[],
): CorrectionResult | null {
  // Need all 4 markers
  const markerMap = new Map(markers.map((m) => [m.id, m]));
  if (markerMap.size < 4) return null;

  for (let id = 0; id < 4; id++) {
    if (!markerMap.has(id)) return null;
  }

  // Source points: outer corners of each marker
  const tl = getOuterCorner(markerMap.get(0)!);
  const tr = getOuterCorner(markerMap.get(1)!);
  const br = getOuterCorner(markerMap.get(2)!);
  const bl = getOuterCorner(markerMap.get(3)!);

  const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    tl.x, tl.y,
    tr.x, tr.y,
    br.x, br.y,
    bl.x, bl.y,
  ]);

  const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0, 0,
    A4_WIDTH, 0,
    A4_WIDTH, A4_HEIGHT,
    0, A4_HEIGHT,
  ]);

  const M = cv.getPerspectiveTransform(srcPts, dstPts);
  const corrected = new cv.Mat();

  try {
    cv.warpPerspective(
      src,
      corrected,
      M,
      new cv.Size(A4_WIDTH, A4_HEIGHT),
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT,
      new cv.Scalar(255, 255, 255, 255),
    );

    return { corrected, width: A4_WIDTH, height: A4_HEIGHT };
  } finally {
    srcPts.delete();
    dstPts.delete();
    M.delete();
    // Note: corrected is NOT deleted here — caller is responsible
  }
}

/**
 * Convert a cv.Mat to a JPEG Blob via canvas.
 */
export function matToBlob(cv: CV, mat: CV, quality = 0.92): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = mat.cols;
  canvas.height = mat.rows;

  cv.imshow(canvas, mat);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('matToBlob failed'))),
      'image/jpeg',
      quality,
    );
  });
}
