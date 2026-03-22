/**
 * Single-digit classifier using ONNX Runtime Web + quantized MNIST model.
 *
 * Classifies 28×28 grayscale images of handwritten digits (0–9).
 * Uses mnist-12-int8.onnx (11 KB quantized model, 99%+ accuracy on MNIST).
 */

import * as ort from 'onnxruntime-web';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

/** Model input dimension (32×32 for MNIST+SVHN trained model) */
const IMG_DIM = 32;

export interface DigitResult {
  digit: number;
  confidence: number;
  /** The 28×28 MNIST input patch as ImageData (grayscale rendered to RGBA) */
  mnistPatch?: ImageData;
}

let session: ort.InferenceSession | null = null;
let initPromise: Promise<ort.InferenceSession> | null = null;

/**
 * Initialize the ONNX inference session.
 */
export function initClassifier(): Promise<ort.InferenceSession> {
  if (session) return Promise.resolve(session);
  if (initPromise) return initPromise;

  initPromise = (async () => {
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1/dist/';

    const modelUrl = `${import.meta.env.BASE_URL}models/digit-classifier.onnx`;
    session = await ort.InferenceSession.create(modelUrl, {
      executionProviders: ['wasm'],
    });
    return session;
  })();

  return initPromise;
}

/**
 * Classify a single digit from a preprocessed (binarized) ImageData.
 *
 * Extracts the digit stroke by removing borders, finding the largest
 * connected component, centering it in a 20×20 box within a 28×28 frame
 * (matching MNIST conventions).
 */
export async function classifyDigit(imageData: ImageData): Promise<DigitResult> {
  const sess = await initClassifier();
  const input = preprocessForMNIST(imageData);

  const tensor = new ort.Tensor('float32', input, [1, 1, 32, 32]);
  const results = await sess.run({ input: tensor });
  const logits = Array.from(results['logits'].data as Float32Array);

  const probs = softmax(logits);
  const digit = probs.indexOf(Math.max(...probs));
  const confidence = probs[digit] * 100;

  return { digit, confidence };
}

/**
 * Classify using OpenCV with connected component isolation.
 *
 * 1. Binarize with adaptive threshold
 * 2. Find connected components
 * 3. If an isolated component (not touching any edge) exists, extract its mask
 * 4. Resize mask to fit 20×20, center in 28×28
 * 5. Fall back to inset+grayscale if no isolated component found
 */
export async function classifyDigitWithCV(
  cv: CV,
  cellMat: CV,
): Promise<DigitResult> {
  const sess = await initClassifier();
  const input = preprocessWithCC(cv, cellMat);

  // Model expects [-1, 1] normalization: foreground=1→0.5 after normalize, background=0→-0.5
  // Input from preprocessWithCC is [0, 1] (foreground=1, background=0)
  // Normalize: (x - 0.5) / 0.5 = 2*x - 1
  const IMG_SIZE = 32;
  const normalized = new Float32Array(IMG_SIZE * IMG_SIZE);
  for (let i = 0; i < normalized.length; i++) {
    normalized[i] = input[i] * 2 - 1;
  }

  const tensor = new ort.Tensor('float32', normalized, [1, 1, IMG_SIZE, IMG_SIZE]);
  const results = await sess.run({ input: tensor });
  const logits = Array.from(results['logits'].data as Float32Array);

  const probs = softmax(logits);
  const digit = probs.indexOf(Math.max(...probs));
  const confidence = probs[digit] * 100;

  // Convert the 32×32 float input to an RGBA ImageData for debug visualization
  const patchData = new Uint8ClampedArray(IMG_SIZE * IMG_SIZE * 4);
  for (let i = 0; i < IMG_SIZE * IMG_SIZE; i++) {
    const v = Math.round((1 - input[i]) * 255); // invert for display: black digit on white bg
    patchData[i * 4] = v;
    patchData[i * 4 + 1] = v;
    patchData[i * 4 + 2] = v;
    patchData[i * 4 + 3] = 255;
  }
  const mnistPatch = new ImageData(patchData, IMG_SIZE, IMG_SIZE);

  return { digit, confidence, mnistPatch };
}

/**
 * Connected-component-based preprocessing for MNIST.
 *
 * 1. Binarize, find connected components
 * 2. If an isolated (non-edge-touching) component exists, extract its mask
 * 3. Otherwise, force separation by clearing pixels one row/column in from
 *    each edge, then re-run CC analysis to find the now-separated digit
 * 4. Resize mask to 20×20, center in 28×28
 */
function preprocessWithCC(cv: CV, src: CV): Float32Array {
  // 1. Grayscale
  const gray = new cv.Mat();
  if (src.channels() === 4) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else if (src.channels() === 3) {
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
  } else {
    src.copyTo(gray);
  }

  // 2. Adaptive threshold → binary (ink=255, paper=0)
  const binary = new cv.Mat();
  cv.adaptiveThreshold(gray, binary, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY_INV, 15, 10);
  gray.delete();

  const w = binary.cols, h = binary.rows;

  // 3. Try to find an isolated component (pass 1)
  let bestLabel = findLargestIsolatedComponent(cv, binary);

  let separated: CV | null = null;
  if (bestLabel < 0) {
    // No isolated component — force separation by clearing pixels one row/column
    // in from each edge. This breaks the connection between digit strokes and
    // the printed box border.
    separated = new cv.Mat();
    binary.copyTo(separated);

    // Clear row 1 and row h-2 (one in from top and bottom edges)
    for (let x = 0; x < w; x++) {
      separated.ucharPtr(1, x)[0] = 0;
      separated.ucharPtr(h - 2, x)[0] = 0;
    }
    // Clear column 1 and column w-2 (one in from left and right edges)
    for (let y = 0; y < h; y++) {
      separated.ucharPtr(y, 1)[0] = 0;
      separated.ucharPtr(y, w - 2)[0] = 0;
    }

    // Re-run CC on the separated image
    bestLabel = findLargestIsolatedComponent(cv, separated);
  }

  const source = separated || binary;
  let result: Float32Array;

  if (bestLabel >= 0) {
    result = extractComponentToMNIST(cv, source, bestLabel);
  } else {
    // Still no isolated component even after separation — use the largest
    // component regardless (best effort)
    const fallbackLabel = findLargestComponent(cv, source);
    if (fallbackLabel >= 0) {
      result = extractComponentToMNIST(cv, source, fallbackLabel);
    } else {
      // Empty image — return blank
      result = new Float32Array(784);
    }
  }

  if (separated) separated.delete();
  binary.delete();

  return result;
}

/**
 * Find the largest connected component that does NOT touch any image edge.
 * Returns the label, or -1 if none found.
 */
function findLargestIsolatedComponent(cv: CV, binary: CV): number {
  const labels = new cv.Mat();
  const stats = new cv.Mat();
  const centroids = new cv.Mat();
  const numLabels = cv.connectedComponentsWithStats(binary, labels, stats, centroids);

  const w = binary.cols, h = binary.rows;
  const minArea = w * h * 0.05;

  let bestLabel = -1;
  let bestArea = 0;
  for (let label = 1; label < numLabels; label++) {
    const left = stats.intAt(label, cv.CC_STAT_LEFT);
    const top = stats.intAt(label, cv.CC_STAT_TOP);
    const cw = stats.intAt(label, cv.CC_STAT_WIDTH);
    const ch = stats.intAt(label, cv.CC_STAT_HEIGHT);
    const area = stats.intAt(label, cv.CC_STAT_AREA);

    if (area < minArea) continue;
    const touchesEdge = (left <= 0 || top <= 0 || left + cw >= w || top + ch >= h);
    if (!touchesEdge && area > bestArea) {
      bestLabel = label;
      bestArea = area;
    }
  }

  labels.delete();
  stats.delete();
  centroids.delete();

  return bestLabel;
}

/**
 * Find the largest connected component (regardless of edge touching).
 * Returns the label, or -1 if none found.
 */
function findLargestComponent(cv: CV, binary: CV): number {
  const labels = new cv.Mat();
  const stats = new cv.Mat();
  const centroids = new cv.Mat();
  const numLabels = cv.connectedComponentsWithStats(binary, labels, stats, centroids);

  let bestLabel = -1;
  let bestArea = 0;
  for (let label = 1; label < numLabels; label++) {
    const area = stats.intAt(label, cv.CC_STAT_AREA);
    if (area > bestArea) {
      bestLabel = label;
      bestArea = area;
    }
  }

  labels.delete();
  stats.delete();
  centroids.delete();

  return bestLabel;
}

/**
 * Extract a component's mask and place it into a 28×28 MNIST frame.
 *
 * Strategy to minimize resampling:
 * 1. Try placing the mask at native resolution into a 26×26 area
 *    (centered by center of mass at pixel 14,14).
 * 2. If it doesn't fit, downscale by exactly 2× using 2×2 pixel binning
 *    (no interpolation artifacts) and try again.
 * 3. If still doesn't fit after 2× bin, place anyway (clip to 28×28).
 */
function extractComponentToMNIST(cv: CV, binary: CV, targetLabel: number): Float32Array {
  const labels = new cv.Mat();
  const stats = new cv.Mat();
  const centroids = new cv.Mat();
  cv.connectedComponentsWithStats(binary, labels, stats, centroids);

  const compLeft = stats.intAt(targetLabel, cv.CC_STAT_LEFT);
  const compTop = stats.intAt(targetLabel, cv.CC_STAT_TOP);
  const compW = stats.intAt(targetLabel, cv.CC_STAT_WIDTH);
  const compH = stats.intAt(targetLabel, cv.CC_STAT_HEIGHT);

  // Build mask of just this component at its bounding box
  const mask = new cv.Mat(compH, compW, cv.CV_8UC1, new cv.Scalar(0));
  for (let y = 0; y < compH; y++) {
    for (let x = 0; x < compW; x++) {
      if (labels.intAt(compTop + y, compLeft + x) === targetLabel) {
        mask.ucharPtr(y, x)[0] = 255;
      }
    }
  }

  labels.delete();
  stats.delete();
  centroids.delete();

  // Try placing at native resolution
  let result = tryPlaceInFrame(mask);
  if (!result) {
    // Downscale by exactly 2× using 2×2 pixel binning
    const half = bin2x(cv, mask);
    result = tryPlaceInFrame(half);
    if (!result) {
      // Force-place (clip to 28×28 bounds)
      result = forcePlaceInFrame(half);
    }
    half.delete();
  }

  mask.delete();
  return result;
}

/**
 * Try to place a mask into a 28×28 frame with its center of mass at (14,14).
 * Returns the Float32Array if it fits within a 30×30 area (1px border in 32×32), or null.
 */
function tryPlaceInFrame(mask: CV): Float32Array | null {
  const mh = mask.rows, mw = mask.cols;
  const { offX, offY } = computeCoMOffset(mask);

  // Check if all pixels fit within 1..30 (leaving 1px border in 32×32 frame)
  if (offX < 1 || offY < 1 || offX + mw - 1 > 30 || offY + mh - 1 > 30) {
    return null;
  }

  const result = new Float32Array(IMG_DIM * IMG_DIM);
  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const dx = offX + x, dy = offY + y;
      result[dy * IMG_DIM + dx] = mask.ucharAt(y, x) / 255.0;
    }
  }
  return result;
}

/**
 * Force-place a mask into a 28×28 frame, clipping any pixels outside bounds.
 */
function forcePlaceInFrame(mask: CV): Float32Array {
  const mh = mask.rows, mw = mask.cols;
  const { offX, offY } = computeCoMOffset(mask);

  const result = new Float32Array(IMG_DIM * IMG_DIM);
  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const dx = offX + x, dy = offY + y;
      if (dx >= 0 && dx < IMG_DIM && dy >= 0 && dy < IMG_DIM) {
        result[dy * IMG_DIM + dx] = mask.ucharAt(y, x) / 255.0;
      }
    }
  }
  return result;
}

/**
 * Compute the offset to place a mask's center of mass at (14, 14).
 */
function computeCoMOffset(mask: CV): { offX: number; offY: number } {
  const mh = mask.rows, mw = mask.cols;
  let massX = 0, massY = 0, totalMass = 0;
  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const v = mask.ucharAt(y, x);
      if (v > 0) { massX += x * v; massY += y * v; totalMass += v; }
    }
  }
  const center = IMG_DIM / 2; // 16 for 32×32
  if (totalMass > 0) {
    return {
      offX: Math.round(center - massX / totalMass),
      offY: Math.round(center - massY / totalMass),
    };
  }
  return {
    offX: Math.round((IMG_DIM - mw) / 2),
    offY: Math.round((IMG_DIM - mh) / 2),
  };
}

/**
 * Downscale a mask by exactly 2× using 2×2 pixel binning (average of 4 pixels).
 * Caller must delete the returned Mat.
 */
function bin2x(cv: CV, mat: CV): CV {
  const h = mat.rows, w = mat.cols;
  const nh = Math.floor(h / 2), nw = Math.floor(w / 2);
  const out = new cv.Mat(nh, nw, cv.CV_8UC1, new cv.Scalar(0));
  for (let y = 0; y < nh; y++) {
    for (let x = 0; x < nw; x++) {
      const sum = mat.ucharAt(y * 2, x * 2) + mat.ucharAt(y * 2 + 1, x * 2)
                + mat.ucharAt(y * 2, x * 2 + 1) + mat.ucharAt(y * 2 + 1, x * 2 + 1);
      out.ucharPtr(y, x)[0] = Math.min(255, Math.round(sum / 4));
    }
  }
  return out;
}

/**
 * Simple preprocessing without OpenCV (fallback).
 */
function preprocessForMNIST(imageData: ImageData): Float32Array {
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = imageData.width;
  srcCanvas.height = imageData.height;
  const srcCtx = srcCanvas.getContext('2d')!;
  srcCtx.putImageData(imageData, 0, 0);

  const dstCanvas = document.createElement('canvas');
  dstCanvas.width = 28;
  dstCanvas.height = 28;
  const dstCtx = dstCanvas.getContext('2d')!;
  dstCtx.fillStyle = 'white';
  dstCtx.fillRect(0, 0, 28, 28);
  dstCtx.drawImage(srcCanvas, 0, 0, 28, 28);

  const resized = dstCtx.getImageData(0, 0, 28, 28);
  const result = new Float32Array(784);

  for (let i = 0; i < 784; i++) {
    const r = resized.data[i * 4];
    const g = resized.data[i * 4 + 1];
    const b = resized.data[i * 4 + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    result[i] = (255 - gray) / 255;
  }

  return result;
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}
