/**
 * ArUco DICT_4X4_50 marker bit patterns for IDs 0–3.
 *
 * Each marker is a 4×4 grid of bits (row-major). The physical marker has
 * a 1-cell black border around this grid, making the total pattern 6×6.
 *
 * These values come from OpenCV's predefined DICT_4X4_50 dictionary.
 * See: https://docs.opencv.org/4.x/d9/d6a/group__aruco.html
 */
export const DICT_4X4_50: ReadonlyArray<ReadonlyArray<number>> = [
  // ID 0
  [
    1, 0, 0, 0,
    1, 0, 1, 1,
    0, 1, 0, 0,
    0, 1, 1, 1,
  ],
  // ID 1
  [
    1, 0, 1, 1,
    0, 1, 0, 0,
    0, 1, 1, 1,
    1, 0, 0, 0,
  ],
  // ID 2
  [
    0, 1, 0, 0,
    0, 1, 1, 1,
    1, 0, 0, 0,
    1, 0, 1, 1,
  ],
  // ID 3
  [
    0, 1, 1, 1,
    1, 0, 0, 0,
    1, 0, 1, 1,
    0, 1, 0, 0,
  ],
];

/** Rotate a 4×4 bit pattern 90° clockwise. */
export function rotate90(bits: ReadonlyArray<number>): number[] {
  const out = new Array<number>(16);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      // (r,c) → (c, 3-r)
      out[c * 4 + (3 - r)] = bits[r * 4 + c];
    }
  }
  return out;
}

/**
 * Match a 4×4 bit pattern against the dictionary.
 * Returns { id, rotation } or null if no match.
 * rotation is the number of 90° CW rotations applied to the candidate
 * to match the canonical pattern.
 */
export function matchMarker(
  bits: number[],
): { id: number; rotation: number } | null {
  for (let id = 0; id < DICT_4X4_50.length; id++) {
    let candidate = bits;
    for (let rot = 0; rot < 4; rot++) {
      if (arraysEqual(candidate, DICT_4X4_50[id])) {
        return { id, rotation: rot };
      }
      candidate = rotate90(candidate);
    }
  }
  return null;
}

function arraysEqual(a: ArrayLike<number>, b: ReadonlyArray<number>): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
