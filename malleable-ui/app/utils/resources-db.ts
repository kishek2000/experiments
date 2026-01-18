// IndexedDB utility for tracking resource progress and notes

const DB_NAME = "generative-ui-resources";
const DB_VERSION = 1;
const STORE_NAME = "progress";

export interface ResourceProgress {
  resourceId: string;
  completed: boolean;
  completedAt?: number;
  notes: string;
  updatedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "resourceId" });
        store.createIndex("completed", "completed", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };
  });

  return dbPromise;
}

export async function getProgress(resourceId: string): Promise<ResourceProgress | null> {
  const db = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(resourceId);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getAllProgress(): Promise<Record<string, ResourceProgress>> {
  const db = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const results: Record<string, ResourceProgress> = {};
      for (const item of request.result) {
        results[item.resourceId] = item;
      }
      resolve(results);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveProgress(progress: ResourceProgress): Promise<void> {
  const db = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({
      ...progress,
      updatedAt: Date.now(),
    });

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function toggleCompleted(resourceId: string): Promise<ResourceProgress> {
  const existing = await getProgress(resourceId);
  
  const updated: ResourceProgress = {
    resourceId,
    completed: existing ? !existing.completed : true,
    completedAt: existing?.completed ? undefined : Date.now(),
    notes: existing?.notes || "",
    updatedAt: Date.now(),
  };
  
  await saveProgress(updated);
  return updated;
}

export async function updateNotes(resourceId: string, notes: string): Promise<ResourceProgress> {
  const existing = await getProgress(resourceId);
  
  const updated: ResourceProgress = {
    resourceId,
    completed: existing?.completed || false,
    completedAt: existing?.completedAt,
    notes,
    updatedAt: Date.now(),
  };
  
  await saveProgress(updated);
  return updated;
}

export async function getStats(): Promise<{
  total: number;
  completed: number;
  percentage: number;
}> {
  const all = await getAllProgress();
  const entries = Object.values(all);
  const completed = entries.filter(e => e.completed).length;
  
  return {
    total: entries.length,
    completed,
    percentage: entries.length > 0 ? Math.round((completed / entries.length) * 100) : 0,
  };
}

// Generate a stable ID for a resource based on its title
export function generateResourceId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

