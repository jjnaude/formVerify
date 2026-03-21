/**
 * Single-digit classifier using ONNX Runtime Web + quantized MNIST model.
 *
 * Classifies 28×28 grayscale images of handwritten digits (0–9).
 * Uses mnist-12-int8.onnx (11 KB quantized model, 99%+ accuracy on MNIST).
 */

import * as ort from 'onnxruntime-web';

export interface DigitResult {
  digit: number;
  confidence: number;
}

let session: ort.InferenceSession | null = null;
let initPromise: Promise<ort.InferenceSession> | null = null;

/**
 * Initialize the ONNX inference session.
 * Call once before classifying; subsequent calls are no-ops.
 */
export function initClassifier(): Promise<ort.InferenceSession> {
  if (session) return Promise.resolve(session);
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // Configure WASM backend
    ort.env.wasm.numThreads = 1;
    // Use CDN for WASM files to avoid bundling/serving issues
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1/dist/';

    const modelUrl = `${import.meta.env.BASE_URL}models/mnist-12-int8.onnx`;
    session = await ort.InferenceSession.create(modelUrl, {
      executionProviders: ['wasm'],
    });
    return session;
  })();

  return initPromise;
}

/**
 * Classify a single digit from an ImageData.
 *
 * The input is resized to 28×28, converted to grayscale, and normalized
 * to the range the MNIST model expects (0–1, white background = 0).
 */
export async function classifyDigit(imageData: ImageData): Promise<DigitResult> {
  const sess = await initClassifier();

  // Resize to 28×28 and convert to grayscale float array
  const input = preprocessForMNIST(imageData);

  // MNIST model: input "Input3" shape [1, 1, 28, 28]
  const tensor = new ort.Tensor('float32', input, [1, 1, 28, 28]);
  const results = await sess.run({ Input3: tensor });

  // Output "Plus214_Output_0" contains logits for digits 0–9
  const logits = Array.from(results['Plus214_Output_0'].data as Float32Array);

  // Softmax to get probabilities
  const probs = softmax(logits);
  const digit = probs.indexOf(Math.max(...probs));
  const confidence = probs[digit] * 100;

  return { digit, confidence };
}

/**
 * Resize ImageData to 28×28, convert to grayscale, normalize.
 *
 * MNIST convention: white background = 0, black ink = 1.
 * Input images have black text on white background, so we invert.
 */
function preprocessForMNIST(imageData: ImageData): Float32Array {
  // Use canvas to resize
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = imageData.width;
  srcCanvas.height = imageData.height;
  const srcCtx = srcCanvas.getContext('2d')!;
  srcCtx.putImageData(imageData, 0, 0);

  const dstCanvas = document.createElement('canvas');
  dstCanvas.width = 28;
  dstCanvas.height = 28;
  const dstCtx = dstCanvas.getContext('2d')!;

  // Fill with white, then draw the source image scaled down
  dstCtx.fillStyle = 'white';
  dstCtx.fillRect(0, 0, 28, 28);
  dstCtx.drawImage(srcCanvas, 0, 0, 28, 28);

  const resized = dstCtx.getImageData(0, 0, 28, 28);
  const result = new Float32Array(784);

  for (let i = 0; i < 784; i++) {
    const r = resized.data[i * 4];
    const g = resized.data[i * 4 + 1];
    const b = resized.data[i * 4 + 2];
    // Grayscale luminance
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    // MNIST: invert (white=0, black=1) and normalize to 0–1
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
