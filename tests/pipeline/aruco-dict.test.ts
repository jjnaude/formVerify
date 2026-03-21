import { describe, it, expect } from 'vitest';
import { DICT_4X4_50, rotate90, matchMarker } from '../../src/pipeline/aruco-dict.js';

describe('aruco-dict', () => {
  describe('DICT_4X4_50', () => {
    it('has 4 marker patterns', () => {
      expect(DICT_4X4_50).toHaveLength(4);
    });

    it('each pattern has 16 bits', () => {
      for (const pattern of DICT_4X4_50) {
        expect(pattern).toHaveLength(16);
      }
    });

    it('all bits are 0 or 1', () => {
      for (const pattern of DICT_4X4_50) {
        for (const bit of pattern) {
          expect(bit === 0 || bit === 1).toBe(true);
        }
      }
    });
  });

  describe('rotate90', () => {
    it('rotates a 4x4 grid 90° clockwise', () => {
      // Simple pattern:
      // 1 0 0 0    0 1 1 1
      // 1 0 0 0 →  0 0 0 0
      // 1 0 0 0    0 0 0 0
      // 1 0 0 0    0 0 0 0
      const input = [
        1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,
      ];
      const expected = [
        1, 1, 1, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ];
      expect(rotate90(input)).toEqual(expected);
    });

    it('4 rotations return to original', () => {
      const original = [...DICT_4X4_50[0]];
      let current = [...original];
      for (let i = 0; i < 4; i++) {
        current = rotate90(current);
      }
      expect(current).toEqual(original);
    });
  });

  describe('matchMarker', () => {
    it('matches canonical patterns at rotation 0', () => {
      for (let id = 0; id < DICT_4X4_50.length; id++) {
        const result = matchMarker([...DICT_4X4_50[id]]);
        expect(result).not.toBeNull();
        expect(result!.id).toBe(id);
        expect(result!.rotation).toBe(0);
      }
    });

    it('matches a rotated pattern', () => {
      // Rotate ID 0 once (90° CW) — needs 3 more rotations to return to canonical
      const rotated = rotate90(DICT_4X4_50[0]);
      const result = matchMarker(rotated);
      expect(result).not.toBeNull();
      expect(result!.id).toBe(0);
      expect(result!.rotation).toBe(3);
    });

    it('matches after 2 rotations', () => {
      // Rotate ID 2 twice — needs 2 more rotations to return to canonical
      let bits = [...DICT_4X4_50[2]];
      bits = rotate90(bits);
      bits = rotate90(bits);
      const result = matchMarker(bits);
      expect(result).not.toBeNull();
      expect(result!.id).toBe(2);
      expect(result!.rotation).toBe(2);
    });

    it('returns null for non-matching pattern', () => {
      const garbage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      expect(matchMarker(garbage)).toBeNull();
    });
  });
});
