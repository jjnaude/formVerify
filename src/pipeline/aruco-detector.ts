/**
 * ArUco marker detector using OpenCV.js native ArUco module.
 *
 * Uses cv.aruco_ArucoDetector with DICT_4X4_50 dictionary.
 * Falls back to a custom contour-based detector if the native
 * module is unavailable.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

export interface DetectedMarker {
  id: number;
  /** Four corners in image coordinates, ordered: TL, TR, BR, BL. */
  corners: [Point, Point, Point, Point];
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Detect ArUco DICT_4X4_50 markers (IDs 0–3) in an image.
 *
 * @param cv - OpenCV.js module
 * @param src - Source image as cv.Mat (any color format)
 * @returns Array of detected markers with their IDs and corner positions
 */
export function detectMarkers(cv: CV, src: CV): DetectedMarker[] {
  // Convert to grayscale if needed
  const gray = new cv.Mat();
  if (src.channels() === 4) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else if (src.channels() === 3) {
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
  } else {
    src.copyTo(gray);
  }

  try {
    return detectWithNativeAruco(cv, gray);
  } finally {
    gray.delete();
  }
}

/**
 * Use OpenCV's built-in ArUco detector (cv.aruco_ArucoDetector).
 */
function detectWithNativeAruco(cv: CV, gray: CV): DetectedMarker[] {
  const dictionary = cv.getPredefinedDictionary(cv.DICT_4X4_50);
  const parameters = new cv.aruco_DetectorParameters();
  const refineParams = new cv.aruco_RefineParameters(10, 3, true);
  const detector = new cv.aruco_ArucoDetector(dictionary, parameters, refineParams);

  const corners = new cv.MatVector();
  const ids = new cv.Mat();
  const rejected = new cv.MatVector();

  try {
    detector.detectMarkers(gray, corners, ids, rejected);

    const markers: DetectedMarker[] = [];
    for (let i = 0; i < ids.rows; i++) {
      const id = ids.intAt(i, 0);
      // Only keep IDs 0–3
      if (id < 0 || id > 3) continue;

      const cornerMat = corners.get(i);
      const pts: Point[] = [];
      for (let j = 0; j < 4; j++) {
        pts.push({
          x: cornerMat.floatAt(0, j * 2),
          y: cornerMat.floatAt(0, j * 2 + 1),
        });
      }
      cornerMat.delete();

      markers.push({
        id,
        corners: pts as [Point, Point, Point, Point],
      });
    }

    return markers;
  } finally {
    corners.delete();
    ids.delete();
    rejected.delete();
    detector.delete();
    refineParams.delete();
    parameters.delete();
    dictionary.delete();
  }
}
