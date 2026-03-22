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
 * Tries to find an isolated digit component (not touching any edge of the cell).
 * If found, extracts the component MASK (binary pixels only for that component),
 * resizes to 20×20 and centers in 28×28. This cleanly removes box borders and
 * adjacent cell bleed-through.
 *
 * Falls back to the old inset+grayscale approach if no isolated component exists.
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

  // 3. Connected components with stats
  const labels = new cv.Mat();
  const stats = new cv.Mat();
  const centroids = new cv.Mat();
  const numLabels = cv.connectedComponentsWithStats(binary, labels, stats, centroids);

  const w = binary.cols, h = binary.rows;
  const minArea = w * h * 0.05;

  // Find the largest non-edge-touching component
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

  let result: Float32Array;

  if (bestLabel >= 0) {
    // Extract the component mask: only pixels belonging to this label
    const compLeft = stats.intAt(bestLabel, cv.CC_STAT_LEFT);
    const compTop = stats.intAt(bestLabel, cv.CC_STAT_TOP);
    const compW = stats.intAt(bestLabel, cv.CC_STAT_WIDTH);
    const compH = stats.intAt(bestLabel, cv.CC_STAT_HEIGHT);

    // Build a mask image of just this component's bounding box
    const mask = new cv.Mat(compH, compW, cv.CV_8UC1, new cv.Scalar(0));
    for (let y = 0; y < compH; y++) {
      for (let x = 0; x < compW; x++) {
        if (labels.intAt(compTop + y, compLeft + x) === bestLabel) {
          mask.ucharPtr(y, x)[0] = 255;
        }
      }
    }

    // Resize mask to fit 20×20
    const targetSize = 20;
    const scale = Math.min(targetSize / compW, targetSize / compH);
    const nw = Math.max(1, Math.round(compW * scale));
    const nh = Math.max(1, Math.round(compH * scale));
    const resized = new cv.Mat();
    cv.resize(mask, resized, new cv.Size(nw, nh), 0, 0, cv.INTER_AREA);
    mask.delete();

    // Center in 28×28, MNIST format (white ink on black background)
    result = new Float32Array(784);
    const offX = Math.round((28 - nw) / 2);
    const offY = Math.round((28 - nh) / 2);
    for (let y = 0; y < nh; y++) {
      for (let x = 0; x < nw; x++) {
        const idx = (offY + y) * 28 + (offX + x);
        if (idx >= 0 && idx < 784) {
          result[idx] = resized.ucharAt(y, x) / 255.0;
        }
      }
    }
    resized.delete();
  } else {
    // Fallback: old inset+grayscale approach for edge-touching digits
    result = preprocessFallback(cv, gray);
  }

  labels.delete();
  stats.delete();
  centroids.delete();
  binary.delete();
  gray.delete();

  return result;
}

/**
 * Fallback preprocessing when no isolated component is found.
 * Uses generous inset + grayscale normalization.
 */
function preprocessFallback(cv: CV, gray: CV): Float32Array {
  const insetX = Math.max(4, Math.round(gray.cols * 0.30));
  const insetY = Math.max(4, Math.round(gray.rows * 0.20));
  const iw = Math.max(4, gray.cols - 2 * insetX);
  const ih = Math.max(4, gray.rows - 2 * insetY);
  const insetROI = gray.roi(new cv.Rect(insetX, insetY, iw, ih));
  const cleaned = new cv.Mat();
  insetROI.copyTo(cleaned);
  insetROI.delete();

  const blurred = new cv.Mat();
  cv.GaussianBlur(cleaned, blurred, new cv.Size(3, 3), 0.8);
  cleaned.delete();

  const targetSize = 20;
  const scale = Math.min(targetSize / blurred.cols, targetSize / blurred.rows);
  const newW = Math.max(1, Math.round(blurred.cols * scale));
  const newH = Math.max(1, Math.round(blurred.rows * scale));
  const resized = new cv.Mat();
  cv.resize(blurred, resized, new cv.Size(newW, newH), 0, 0, cv.INTER_AREA);
  blurred.delete();

  const allVals: number[] = [];
  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      allVals.push(resized.ucharAt(y, x));
    }
  }
  allVals.sort((a, b) => a - b);
  const lo = allVals[Math.floor(allVals.length * 0.05)];
  const hi = allVals[Math.floor(allVals.length * 0.95)];
  const range = hi - lo || 1;

  const result = new Float32Array(784);
  const offsetX = Math.round((28 - newW) / 2);
  const offsetY = Math.round((28 - newH) / 2);

  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const val = resized.ucharAt(y, x);
      const normalized = Math.max(0, Math.min(1, (hi - val) / range));
      const idx = (offsetY + y) * 28 + (offsetX + x);
      if (idx >= 0 && idx < 784) {
        result[idx] = normalized;
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
