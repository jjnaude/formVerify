/**
 * OCR module — hybrid approach:
 * - ONNX MNIST classifier for individual digit boxes (99%+ accuracy)
 * - Tesseract.js fallback for multi-character fields (tracking number)
 */

import Tesseract from 'tesseract.js';
import { classifyDigit, initClassifier } from './digit-classifier.js';
import type { ExtractedROI } from './roi-extractor.js';

export interface OCRResult {
  cellId: string;
  row: string;
  col: string;
  text: string;
  confidence: number;
}

let tesseractWorker: Tesseract.Worker | null = null;

async function getTesseractWorker(): Promise<Tesseract.Worker> {
  if (tesseractWorker) return tesseractWorker;

  tesseractWorker = await Tesseract.createWorker('eng', undefined, {
    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core-simd-lstm.wasm.js',
  });

  await tesseractWorker.setParameters({
    tessedit_char_whitelist: '0123456789',
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
  });

  return tesseractWorker;
}

/**
 * Run recognition on a batch of extracted ROIs.
 *
 * Uses ONNX MNIST classifier for digit boxes (cellId contains "_d"),
 * falls back to Tesseract for other fields (e.g. tracking number).
 */
export async function recognizeCells(
  rois: ExtractedROI[],
  onProgress?: (completed: number, total: number) => void,
): Promise<OCRResult[]> {
  // Split into digit boxes and other fields
  const digitROIs = rois.filter((r) => r.cell.id.includes('_d'));
  const otherROIs = rois.filter((r) => !r.cell.id.includes('_d'));

  const results: OCRResult[] = [];
  let completed = 0;
  const total = rois.length;

  // Init ONNX classifier if we have digit boxes
  if (digitROIs.length > 0) {
    await initClassifier();
  }

  // Classify digit boxes with ONNX
  for (const roi of digitROIs) {
    const { digit, confidence } = await classifyDigit(roi.preprocessedData);
    results.push({
      cellId: roi.cell.id,
      row: roi.cell.row,
      col: roi.cell.col,
      text: String(digit),
      confidence,
    });
    completed++;
    onProgress?.(completed, total);
  }

  // Recognize other fields with Tesseract
  if (otherROIs.length > 0) {
    const w = await getTesseractWorker();
    for (const roi of otherROIs) {
      const canvas = document.createElement('canvas');
      canvas.width = roi.preprocessedData.width;
      canvas.height = roi.preprocessedData.height;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(roi.preprocessedData, 0, 0);

      const { data } = await w.recognize(canvas);
      results.push({
        cellId: roi.cell.id,
        row: roi.cell.row,
        col: roi.cell.col,
        text: data.text.trim(),
        confidence: data.confidence,
      });
      completed++;
      onProgress?.(completed, total);
    }
  }

  return results;
}

export async function terminateOCR(): Promise<void> {
  if (tesseractWorker) {
    await tesseractWorker.terminate();
    tesseractWorker = null;
  }
}
