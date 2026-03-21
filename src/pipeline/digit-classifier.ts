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
 * Classify using OpenCV for better digit isolation.
 * This version uses cv to remove borders via morphology before classifying.
 */
export async function classifyDigitWithCV(
  cv: CV,
  cellMat: CV,
): Promise<DigitResult> {
  const sess = await initClassifier();
  const input = preprocessForMNISTWithCV(cv, cellMat);

  const tensor = new ort.Tensor('float32', input, [1, 1, 28, 28]);
  const results = await sess.run({ Input3: tensor });
  const logits = Array.from(results['Plus214_Output_0'].data as Float32Array);

  const probs = softmax(logits);
  const digit = probs.indexOf(Math.max(...probs));
  const confidence = probs[digit] * 100;

  return { digit, confidence };
}

/**
 * Use OpenCV to isolate the digit for MNIST classification:
 * 1. Grayscale → Otsu threshold (binary: ink=white, paper=black)
 * 2. Inset to remove printed box borders
 * 3. Find bounding box of ink pixels, crop tightly
 * 4. Resize to fit 20×20, center in 28×28
 */
function preprocessForMNISTWithCV(cv: CV, src: CV): Float32Array {
  // 1. Grayscale
  const gray = new cv.Mat();
  if (src.channels() === 4) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else if (src.channels() === 3) {
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
  } else {
    src.copyTo(gray);
  }

  // 2. Generous inset to remove printed box borders and adjacent cells
  const insetX = Math.max(4, Math.round(gray.cols * 0.30));
  const insetY = Math.max(4, Math.round(gray.rows * 0.20));
  const iw = Math.max(4, gray.cols - 2 * insetX);
  const ih = Math.max(4, gray.rows - 2 * insetY);
  const insetROI = gray.roi(new cv.Rect(insetX, insetY, iw, ih));
  const cleaned = new cv.Mat();
  insetROI.copyTo(cleaned);
  insetROI.delete();
  gray.delete();

  // 3. Apply Gaussian blur to thicken thin strokes (makes more MNIST-like)
  const blurred = new cv.Mat();
  cv.GaussianBlur(cleaned, blurred, new cv.Size(3, 3), 0.8);
  cleaned.delete();

  // 4. Resize to fit 20×20, center in 28×28
  const targetSize = 20;
  const scale = Math.min(targetSize / blurred.cols, targetSize / blurred.rows);
  const newW = Math.max(1, Math.round(blurred.cols * scale));
  const newH = Math.max(1, Math.round(blurred.rows * scale));
  const resized = new cv.Mat();
  cv.resize(blurred, resized, new cv.Size(newW, newH), 0, 0, cv.INTER_AREA);
  blurred.delete();

  // 5. Build MNIST-style input
  // Read all pixel values, compute robust percentiles for normalization
  const allVals: number[] = [];
  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      allVals.push(resized.ucharAt(y, x));
    }
  }
  allVals.sort((a, b) => a - b);
  // Use 5th and 95th percentile for robust normalization
  const lo = allVals[Math.floor(allVals.length * 0.05)];
  const hi = allVals[Math.floor(allVals.length * 0.95)];
  const range = hi - lo || 1;

  const result = new Float32Array(784);
  const offsetX = Math.round((28 - newW) / 2);
  const offsetY = Math.round((28 - newH) / 2);

  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const val = resized.ucharAt(y, x);
      // Normalize and invert: dark ink → high value, light paper → low value
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
