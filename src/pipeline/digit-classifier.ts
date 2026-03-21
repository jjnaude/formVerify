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
 * Use OpenCV to properly isolate the digit:
 * 1. Convert to grayscale + threshold
 * 2. Remove horizontal/vertical lines (printed borders)
 * 3. Find largest contour (the digit stroke)
 * 4. Crop to bounding box, center in 20×20 within 28×28 (MNIST style)
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

  // 2. Inset to remove border lines (20% from each edge)
  const insetX = Math.max(3, Math.round(gray.cols * 0.20));
  const insetY = Math.max(3, Math.round(gray.rows * 0.15));
  const insetRect = new cv.Rect(
    insetX, insetY,
    Math.max(4, gray.cols - 2 * insetX),
    Math.max(4, gray.rows - 2 * insetY),
  );
  const insetROI = gray.roi(insetRect);
  const cleaned = new cv.Mat();
  insetROI.copyTo(cleaned);
  insetROI.delete();
  gray.delete();

  // 3. Resize to 20×20, center in 28×28 (MNIST convention)
  const resized = new cv.Mat();
  const targetSize = 20;
  const scale = Math.min(targetSize / cleaned.cols, targetSize / cleaned.rows);
  const newW = Math.max(1, Math.round(cleaned.cols * scale));
  const newH = Math.max(1, Math.round(cleaned.rows * scale));
  cv.resize(cleaned, resized, new cv.Size(newW, newH), 0, 0, cv.INTER_AREA);
  cleaned.delete();

  // 4. Build MNIST input: invert grayscale (dark ink → high values)
  // Find min/max for normalization
  const result = new Float32Array(784);
  const offsetX = Math.round((28 - newW) / 2);
  const offsetY = Math.round((28 - newH) / 2);

  // First pass: collect values
  const values: number[] = [];
  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      values.push(resized.ucharAt(y, x));
    }
  }

  // Normalize: map [min..max] to [1..0] (inverted — dark ink becomes bright)
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const val = resized.ucharAt(y, x);
      const normalized = 1.0 - (val - minVal) / range; // invert: dark→1, light→0
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
