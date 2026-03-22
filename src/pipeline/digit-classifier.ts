/**
 * Single-digit classifier using ONNX Runtime Web + quantized MNIST model.
 *
 * Classifies 28×28 grayscale images of handwritten digits (0–9).
 * Uses mnist-12-int8.onnx (11 KB quantized model, 99%+ accuracy on MNIST).
 */

import * as ort from 'onnxruntime-web';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

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

    const modelUrl = `${import.meta.env.BASE_URL}models/mnist-8.onnx`;
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

  const tensor = new ort.Tensor('float32', input, [1, 1, 28, 28]);
  const results = await sess.run({ Input3: tensor });
  const logits = Array.from(results['Plus214_Output_0'].data as Float32Array);

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

  const tensor = new ort.Tensor('float32', input, [1, 1, 28, 28]);
  const results = await sess.run({ Input3: tensor });
  const logits = Array.from(results['Plus214_Output_0'].data as Float32Array);

  const probs = softmax(logits);
  const digit = probs.indexOf(Math.max(...probs));
  const confidence = probs[digit] * 100;

  // Convert the 28×28 float input to an RGBA ImageData for debug visualization
  const patchData = new Uint8ClampedArray(28 * 28 * 4);
  for (let i = 0; i < 784; i++) {
    const v = Math.round((1 - input[i]) * 255); // invert: MNIST white-on-black → black-on-white
    patchData[i * 4] = v;
    patchData[i * 4 + 1] = v;
    patchData[i * 4 + 2] = v;
    patchData[i * 4 + 3] = 255;
  }
  const mnistPatch = new ImageData(patchData, 28, 28);

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
 * Extract a specific component's mask from a binary image, resize to 20×20,
 * and center in a 28×28 MNIST-format Float32Array.
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

  // Resize to fit 20×20 (aspect-ratio preserving)
  const targetSize = 20;
  const scale = Math.min(targetSize / compW, targetSize / compH);
  const nw = Math.max(1, Math.round(compW * scale));
  const nh = Math.max(1, Math.round(compH * scale));
  const resized = new cv.Mat();
  cv.resize(mask, resized, new cv.Size(nw, nh), 0, 0, cv.INTER_AREA);
  mask.delete();

  // Compute center of mass of the resized digit
  let massX = 0, massY = 0, totalMass = 0;
  for (let y = 0; y < nh; y++) {
    for (let x = 0; x < nw; x++) {
      const v = resized.ucharAt(y, x);
      if (v > 0) {
        massX += x * v;
        massY += y * v;
        totalMass += v;
      }
    }
  }

  // Center in 28×28 by center of mass (MNIST convention)
  // The center of mass should land at (14, 14) — the center of the 28×28 frame
  const result = new Float32Array(784);
  let offX: number, offY: number;
  if (totalMass > 0) {
    const comX = massX / totalMass;
    const comY = massY / totalMass;
    offX = Math.round(14 - comX);
    offY = Math.round(14 - comY);
  } else {
    // Fallback to bounding-box centering if no mass
    offX = Math.round((28 - nw) / 2);
    offY = Math.round((28 - nh) / 2);
  }

  for (let y = 0; y < nh; y++) {
    for (let x = 0; x < nw; x++) {
      const dx = offX + x;
      const dy = offY + y;
      if (dx >= 0 && dx < 28 && dy >= 0 && dy < 28) {
        result[dy * 28 + dx] = resized.ucharAt(y, x) / 255.0;
      }
    }
  }
  resized.delete();

  return result;
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
