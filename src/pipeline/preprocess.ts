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

/**
 * Create a binary mask of red-ink pixels in an RGBA image.
 * Red ink: R > 80 AND (R-G) > 30 AND (R-B) > 30.
 * @returns Single-channel binary mask (caller must delete)
 */
export function createRedMask(cv: CV, src: CV): CV {
  const channels = new cv.MatVector();
  cv.split(src, channels);
  const r = channels.get(0);
  const g = channels.get(1);
  const b = channels.get(2);

  // Channel differences (saturates at 0 for uchar)
  const rg = new cv.Mat();
  cv.subtract(r, g, rg);
  const rb = new cv.Mat();
  cv.subtract(r, b, rb);
  // Minimum R value to exclude dark shadows
  const rMin = new cv.Mat();
  cv.threshold(r, rMin, 80, 255, cv.THRESH_BINARY);

  channels.delete();

  const rgMask = new cv.Mat();
  cv.threshold(rg, rgMask, 30, 255, cv.THRESH_BINARY);
  rg.delete();

  const rbMask = new cv.Mat();
  cv.threshold(rb, rbMask, 30, 255, cv.THRESH_BINARY);
  rb.delete();

  const mask = new cv.Mat();
  cv.bitwise_and(rgMask, rbMask, mask);
  cv.bitwise_and(mask, rMin, mask);
  rgMask.delete();
  rbMask.delete();
  rMin.delete();

  return mask;
}

/**
 * Remove red ink from an RGBA image (set red pixels to white).
 * Useful for cleaning digit crops: removes printed form lines,
 * leaving only handwritten content.
 * @returns New image with red pixels replaced (caller must delete)
 */
export function removeRedInk(cv: CV, src: CV): CV {
  const mask = createRedMask(cv, src);
  const result = new cv.Mat();
  src.copyTo(result);
  result.setTo(
    src.channels() === 4
      ? new cv.Scalar(255, 255, 255, 255)
      : new cv.Scalar(255, 255, 255),
    mask,
  );
  mask.delete();
  return result;
}
