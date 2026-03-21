/**
 * OCR module using Tesseract.js for handwritten digit recognition.
 *
 * Runs each cropped cell image through Tesseract with digit-only
 * whitelist and single-line mode (PSM 7).
 */

import Tesseract from 'tesseract.js';
import type { ExtractedROI } from './roi-extractor.js';

export interface OCRResult {
  /** Cell ID from form schema */
  cellId: string;
  /** Row name */
  row: string;
  /** Column label */
  col: string;
  /** Recognized text (digits) */
  text: string;
  /** Tesseract confidence (0–100) */
  confidence: number;
}

let worker: Tesseract.Worker | null = null;

async function getWorker(): Promise<Tesseract.Worker> {
  if (worker) return worker;

  worker = await Tesseract.createWorker('eng', undefined, {
    // Use CDN for worker and trained data
    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core-simd-lstm.wasm.js',
  });

  await worker.setParameters({
    tessedit_char_whitelist: '0123456789.',
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR,
  });

  return worker;
}

/**
 * Run OCR on a batch of extracted ROIs.
 *
 * @param rois - Extracted cell images
 * @param onProgress - Optional callback with (completed, total)
 * @returns Array of OCR results
 */
export async function recognizeCells(
  rois: ExtractedROI[],
  onProgress?: (completed: number, total: number) => void,
): Promise<OCRResult[]> {
  const w = await getWorker();
  const results: OCRResult[] = [];

  for (let i = 0; i < rois.length; i++) {
    const { cell, preprocessedData } = rois[i];

    // Convert preprocessed ImageData to canvas for Tesseract
    const canvas = document.createElement('canvas');
    canvas.width = preprocessedData.width;
    canvas.height = preprocessedData.height;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(preprocessedData, 0, 0);

    const { data } = await w.recognize(canvas);
    const text = data.text.trim();

    results.push({
      cellId: cell.id,
      row: cell.row,
      col: cell.col,
      text,
      confidence: data.confidence,
    });

    onProgress?.(i + 1, rois.length);
  }

  return results;
}

/** Clean up the Tesseract worker. */
export async function terminateOCR(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}
