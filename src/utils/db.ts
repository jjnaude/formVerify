import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface CaptureRecord {
  id?: number;
  blob: Blob;
  timestamp: number;
  status: 'captured' | 'processed' | 'verified';
}

interface FormVerifyDB extends DBSchema {
  captures: {
    key: number;
    value: CaptureRecord;
    indexes: {
      'by-timestamp': number;
      'by-status': CaptureRecord['status'];
    };
  };
}

const DB_NAME = 'formVerify';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<FormVerifyDB>> | null = null;

function getDB(): Promise<IDBPDatabase<FormVerifyDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FormVerifyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('captures', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-timestamp', 'timestamp');
        store.createIndex('by-status', 'status');
      },
    });
  }
  return dbPromise;
}

export async function saveCapture(blob: Blob): Promise<number> {
  const db = await getDB();
  const record: CaptureRecord = {
    blob,
    timestamp: Date.now(),
    status: 'captured',
  };
  return db.add('captures', record);
}

export async function getCapture(id: number): Promise<CaptureRecord | undefined> {
  const db = await getDB();
  return db.get('captures', id);
}

export async function getAllCaptures(): Promise<CaptureRecord[]> {
  const db = await getDB();
  return db.getAllFromIndex('captures', 'by-timestamp');
}

export async function deleteCapture(id: number): Promise<void> {
  const db = await getDB();
  return db.delete('captures', id);
}

export async function updateCaptureStatus(
  id: number,
  status: CaptureRecord['status'],
): Promise<void> {
  const db = await getDB();
  const record = await db.get('captures', id);
  if (record) {
    record.status = status;
    await db.put('captures', record);
  }
}
