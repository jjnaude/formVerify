/**
 * Image preprocessing for OCR/digit classification.
 *
 * Converts cell crops to clean binary images:
 * grayscale → CLAHE contrast enhancement → Otsu threshold → border inset.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

/** Number of pixels to trim from each edge to remove border artifacts. */
const BORDER_INSET = 3;

/**
 * Preprocess a cell crop for OCR or digit classification.
 *
 * @param cv - OpenCV.js module
 * @param src - Source cell image (any color format)
 * @returns Preprocessed binary image as cv.Mat (caller must delete)
 */
export function preprocessCell(cv: CV, src: CV): CV {
  // 1. Inset to remove border lines
  const insetSrc = insetBorder(cv, src, BORDER_INSET);

  try {
    // 2. Convert to grayscale
    const gray = new cv.Mat();
    if (insetSrc.channels() === 4) {
      cv.cvtColor(insetSrc, gray, cv.COLOR_RGBA2GRAY);
    } else if (insetSrc.channels() === 3) {
      cv.cvtColor(insetSrc, gray, cv.COLOR_RGB2GRAY);
    } else {
      insetSrc.copyTo(gray);
    }

    // 3. CLAHE contrast enhancement
    const clahe = new cv.CLAHE(2.0, new cv.Size(4, 4));
    const enhanced = new cv.Mat();
    clahe.apply(gray, enhanced);
    gray.delete();
    clahe.delete();

    // 4. Otsu binarization (white background, black text)
    const binary = new cv.Mat();
    cv.threshold(enhanced, binary, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
    enhanced.delete();

    return binary;
  } finally {
    insetSrc.delete();
  }
}

/**
 * Trim pixels from each edge of an image.
 */
function insetBorder(cv: CV, src: CV, inset: number): CV {
  const w = src.cols;
  const h = src.rows;

  // If the image is too small to inset, return a copy
  if (w <= inset * 2 + 4 || h <= inset * 2 + 4) {
    const copy = new cv.Mat();
    src.copyTo(copy);
    return copy;
  }

  const rect = new cv.Rect(inset, inset, w - 2 * inset, h - 2 * inset);
  const roi = src.roi(rect);
  const result = new cv.Mat();
  roi.copyTo(result);
  roi.delete();
  return result;
}
