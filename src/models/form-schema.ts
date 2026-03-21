/**
 * Form schema defining ROI positions for the healthcare waste manifest.
 *
 * All coordinates are normalized (0–1) relative to the corrected image
 * dimensions (the area between the 4 ArUco marker inner corners).
 *
 * These values were measured from public/test-form.html using Playwright.
 */

export interface CellROI {
  /** Unique cell identifier, e.g. "received_90L_RUC" */
  id: string;
  /** Row name */
  row: string;
  /** Column label */
  col: string;
  /** Normalized x (left edge, 0–1) */
  x: number;
  /** Normalized y (top edge, 0–1) */
  y: number;
  /** Normalized width */
  w: number;
  /** Normalized height */
  h: number;
}

export interface FormSchema {
  name: string;
  tracking: CellROI;
  table: CellROI[];
}

const COLUMNS = [
  '90L RUC',
  '7.6L Sharps',
  '20L Sharps',
  '25L Sharps',
  '2.5L Specibin',
  '5L Specibin',
  '10L Specibin',
  '20L Specibin',
  '25L Specibin',
  'Pharma 5L',
  'Pharma 20L',
  '50L Box',
  '142L Box',
  'Other',
];

const ROWS = ['received', 'gross_kg', 'nett_kg'];

// Column x positions and widths (normalized, from Playwright measurement)
const COL_X: number[] = [
  0.01491935, 0.07137097, 0.14879032, 0.22782258, 0.3052, 0.3978, 0.4905, 0.5831, 0.6757, 0.7684,
  0.8518, 0.9352, 0.9858, 1.0436,
];
const COL_W: number[] = [
  0.05645161, 0.07741935, 0.07903226, 0.0783, 0.0926, 0.0926, 0.0926, 0.0926, 0.0926, 0.0834,
  0.0834, 0.0506, 0.0578, 0.0651,
];

// Row y positions (normalized)
const ROW_Y: number[] = [0.1850057, 0.22776511, 0.27052452];
const ROW_H = 0.0431;

function makeId(row: string, col: string): string {
  return `${row}_${col.replace(/[\s.]/g, '_')}`;
}

function buildTable(): CellROI[] {
  const cells: CellROI[] = [];
  for (let ri = 0; ri < ROWS.length; ri++) {
    for (let ci = 0; ci < COLUMNS.length; ci++) {
      cells.push({
        id: makeId(ROWS[ri], COLUMNS[ci]),
        row: ROWS[ri],
        col: COLUMNS[ci],
        x: COL_X[ci],
        y: ROW_Y[ri],
        w: COL_W[ci],
        h: ROW_H,
      });
    }
  }
  return cells;
}

export const MANIFEST_SCHEMA: FormSchema = {
  name: 'Healthcare Waste Manifest',
  tracking: {
    id: 'tracking_no',
    row: 'tracking',
    col: 'tracking_no',
    x: 0.0718,
    y: 0.0627,
    w: 0.3424,
    h: 0.0343,
  },
  table: buildTable(),
};
