/**
 * Image preprocessing for OCR/digit classification.
 *
 * Converts cell crops to clean binary images:
 * grayscale → CLAHE contrast enhancement → Otsu threshold.
 *
 * Note: border removal is now handled by the closed-loop box detector
 * in roi-extractor.ts, so no fixed inset is applied here.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

/**
 * Preprocess a cell crop for OCR or digit classification.
 *
 * @param cv - OpenCV.js module
 * @param src - Source cell image (any color format)
 * @returns Preprocessed binary image as cv.Mat (caller must delete)
 */
export function preprocessCell(cv: CV, src: CV): CV {
  // 1. Convert to grayscale
  const gray = new cv.Mat();
  if (src.channels() === 4) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else if (src.channels() === 3) {
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
  } else {
    src.copyTo(gray);
  }

  // 2. CLAHE contrast enhancement
  const clahe = new cv.CLAHE(2.0, new cv.Size(4, 4));
  const enhanced = new cv.Mat();
  clahe.apply(gray, enhanced);
  gray.delete();
  clahe.delete();

  // 3. Otsu binarization (white background, black text)
  const binary = new cv.Mat();
  cv.threshold(enhanced, binary, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
  enhanced.delete();

  return binary;
}
