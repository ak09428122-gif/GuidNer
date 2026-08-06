/**
 * GuideNer Native IndexedDB Offline Engine
 * Manages local, persistent offline storage for OmniAir Chats, Downloads, Vault, Study, and Browser data.
 */

const DB_NAME = 'GuideNer_Offline_DB_v1';
const DB_VERSION = 1;

export interface DBStores {
  omniair_chats: 'id';
  omniair_messages: 'id';
  vault_items: 'id';
  downloads: 'id';
  browser_bookmarks: 'id';
  browser_history: 'id';
}

class GuideNerIDB {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains('omniair_chats')) {
            const chatStore = db.createObjectStore('omniair_chats', { keyPath: 'id' });
            chatStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          }

          if (!db.objectStoreNames.contains('omniair_messages')) {
            const msgStore = db.createObjectStore('omniair_messages', { keyPath: 'id' });
            msgStore.createIndex('sessionId', 'sessionId', { unique: false });
            msgStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          if (!db.objectStoreNames.contains('vault_items')) {
            db.createObjectStore('vault_items', { keyPath: 'id' });
          }

          if (!db.objectStoreNames.contains('downloads')) {
            db.createObjectStore('downloads', { keyPath: 'id' });
          }

          if (!db.objectStoreNames.contains('browser_bookmarks')) {
            db.createObjectStore('browser_bookmarks', { keyPath: 'id' });
          }

          if (!db.objectStoreNames.contains('browser_history')) {
            db.createObjectStore('browser_history', { keyPath: 'id' });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return this.dbPromise;
  }

  async getAll<T>(storeName: keyof DBStores): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  async getById<T>(storeName: keyof DBStores, id: string): Promise<T | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => reject(req.error);
    });
  }

  async put<T>(storeName: keyof DBStores, item: T): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async delete(storeName: keyof DBStores, id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async clear(storeName: keyof DBStores): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getMessagesForSession<T>(sessionId: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('omniair_messages', 'readonly');
      const store = tx.objectStore('omniair_messages');
      const index = store.index('sessionId');
      const req = index.getAll(sessionId);
      req.onsuccess = () => {
        const results = req.result as T[];
        results.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  }
}

export const offlineDB = new GuideNerIDB();
