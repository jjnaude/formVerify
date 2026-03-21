/**
 * Form schema defining digit-box ROI positions for the healthcare waste manifest.
 *
 * All coordinates are normalized (0–1) relative to the corrected image
 * dimensions (the area between the 4 ArUco marker inner corners).
 *
 * Measured from public/test-form.html (landscape A4, v2 with digit boxes).
 */

export interface CellROI {
  /** Unique cell identifier, e.g. "received_90L_RUC_d0" */
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

/** A digit box within a field, with position metadata for reassembly. */
export interface DigitBoxROI extends CellROI {
  /** Digit position within the field (0 = leftmost) */
  digitIndex: number;
  /** Whether this digit is after the decimal separator */
  isDecimal: boolean;
  /** Field group ID for reassembly, e.g. "received_90L_RUC" */
  fieldId: string;
}

export interface FormSchema {
  name: string;
  orientation: 'portrait' | 'landscape';
  tracking: CellROI;
  digitBoxes: DigitBoxROI[];
}

// --- Column definitions ---

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

// --- Measured from rectified image (2339x1654) ---

// Column x positions (first digit box in each column)
const COL_X: number[] = [
  0.0409, 0.1109, 0.181, 0.2511, 0.3211, 0.3912, 0.4613, 0.5313, 0.6014, 0.6714, 0.7415, 0.8116,
  0.8816, 0.9517,
];

// Row y positions
const ROW_Y: number[] = [0.1485, 0.1822, 0.2145];

// Digit box dimensions (uniform for all boxes)
const BOX_W = 0.0143;
const BOX_H = 0.0308;

// Stride between consecutive digit boxes
const DIGIT_STRIDE = 0.0159;

// Stride across the decimal separator
const DECIMAL_STRIDE = 0.0085;

// Tracking box
// tracking: {
//   id: 'tracking_no',
//   row: 'tracking',
//   col: 'tracking_no',
//   x: 0.0807,
//   y: 0.0321,
//   w: 0.1492,
//   h: 0.0398,
// },
// --- Field structure ---

/** Received row: 3 whole-number digits per field */
const RECEIVED_DIGITS = 3;
/** Gross/Nett KG rows: 3 digits + decimal + 1 digit = 4 boxes */
const KG_WHOLE_DIGITS = 3;
const KG_DECIMAL_DIGITS = 1;

// --- Schema builder ---

function makeFieldId(row: string, col: string): string {
  return `${row}_${col.replace(/[\s.]/g, '_')}`;
}

function buildDigitBoxes(): DigitBoxROI[] {
  const boxes: DigitBoxROI[] = [];

  for (let ri = 0; ri < ROWS.length; ri++) {
    const row = ROWS[ri];
    const isKG = row === 'gross_kg' || row === 'nett_kg';
    const totalDigits = isKG ? KG_WHOLE_DIGITS + KG_DECIMAL_DIGITS : RECEIVED_DIGITS;

    for (let ci = 0; ci < COLUMNS.length; ci++) {
      const col = COLUMNS[ci];
      const fieldId = makeFieldId(row, col);
      const baseX = COL_X[ci];
      const baseY = ROW_Y[ri];

      let xOffset = 0;
      for (let di = 0; di < totalDigits; di++) {
        const isDecimal = isKG && di >= KG_WHOLE_DIGITS;

        boxes.push({
          id: `${fieldId}_d${di}`,
          row,
          col,
          x: baseX + xOffset,
          y: baseY,
          w: BOX_W,
          h: BOX_H,
          digitIndex: di,
          isDecimal,
          fieldId,
        });

        // Advance x: use decimal stride if crossing the decimal point
        if (isKG && di === KG_WHOLE_DIGITS - 1) {
          xOffset += DECIMAL_STRIDE;
        } else {
          xOffset += DIGIT_STRIDE;
        }
      }
    }
  }

  return boxes;
}

export const MANIFEST_SCHEMA: FormSchema = {
  name: 'Healthcare Waste Manifest',
  orientation: 'landscape',
  tracking: {
    id: 'tracking_no',
    row: 'tracking',
    col: 'tracking_no',
    x: 0.0807,
    y: 0.0321,
    w: 0.1492,
    h: 0.0398,
  },
  digitBoxes: buildDigitBoxes(),
};

/**
 * Reassemble individual digit results into field values.
 *
 * @param digits - Map of digit box ID → recognized digit string
 * @returns Map of field ID → assembled value string (e.g. "123,4")
 */
export function assembleFieldValues(digits: Map<string, string>): Map<string, string> {
  // Group digits by fieldId
  const fields = new Map<string, { digitIndex: number; isDecimal: boolean; value: string }[]>();

  for (const [boxId, digit] of digits) {
    // Extract fieldId from boxId (remove _dN suffix)
    const fieldId = boxId.replace(/_d\d+$/, '');
    if (!fields.has(fieldId)) fields.set(fieldId, []);
    const box = MANIFEST_SCHEMA.digitBoxes.find((b) => b.id === boxId);
    if (box) {
      fields.get(fieldId)!.push({
        digitIndex: box.digitIndex,
        isDecimal: box.isDecimal,
        value: digit,
      });
    }
  }

  const result = new Map<string, string>();
  for (const [fieldId, digitEntries] of fields) {
    // Sort by digit index
    digitEntries.sort((a, b) => a.digitIndex - b.digitIndex);

    let value = '';
    let addedDecimal = false;
    for (const entry of digitEntries) {
      if (entry.isDecimal && !addedDecimal) {
        value += ',';
        addedDecimal = true;
      }
      value += entry.value;
    }

    // Trim leading zeros but keep at least one digit
    const trimmed = value.replace(/^0+(?=\d)/, '');
    result.set(fieldId, trimmed || value);
  }

  return result;
}
