import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveCapture,
  getCapture,
  getAllCaptures,
  deleteCapture,
  updateCaptureStatus,
} from '../../src/utils/db.js';

// Reset the IDB between tests by clearing the module cache
// fake-indexeddb/auto patches globalThis, so the DB module picks it up
beforeEach(async () => {
  // Delete all records to isolate tests
  const captures = await getAllCaptures();
  for (const c of captures) {
    if (c.id != null) await deleteCapture(c.id);
  }
});

function makeBlob(content = 'test'): Blob {
  return new Blob([content], { type: 'image/jpeg' });
}

describe('db - captures', () => {
  it('saves and retrieves a capture', async () => {
    const blob = makeBlob();
    const id = await saveCapture(blob);
    expect(id).toBeGreaterThan(0);

    const record = await getCapture(id);
    expect(record).toBeDefined();
    expect(record!.status).toBe('captured');
    expect(record!.timestamp).toBeGreaterThan(0);
    expect(record!.blob.size).toBe(blob.size);
  });

  it('returns undefined for non-existent id', async () => {
    const record = await getCapture(99999);
    expect(record).toBeUndefined();
  });

  it('lists all captures ordered by timestamp', async () => {
    await saveCapture(makeBlob('a'));
    await saveCapture(makeBlob('b'));
    await saveCapture(makeBlob('c'));

    const all = await getAllCaptures();
    expect(all).toHaveLength(3);
    // Timestamps should be non-decreasing
    for (let i = 1; i < all.length; i++) {
      expect(all[i].timestamp).toBeGreaterThanOrEqual(all[i - 1].timestamp);
    }
  });

  it('deletes a capture', async () => {
    const id = await saveCapture(makeBlob());
    await deleteCapture(id);
    const record = await getCapture(id);
    expect(record).toBeUndefined();
  });

  it('updates capture status', async () => {
    const id = await saveCapture(makeBlob());
    await updateCaptureStatus(id, 'processed');

    const record = await getCapture(id);
    expect(record!.status).toBe('processed');
  });

  it('ignores status update for non-existent id', async () => {
    // Should not throw
    await updateCaptureStatus(99999, 'verified');
  });
});
