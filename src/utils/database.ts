export class DatabaseManager {
  private static DB_NAME = "KailoDB";
  private static VERSION = 6; // Incrementing for schema changes
  private static STORES = ["friends", "notes", "topics", "tasks", "dates", "conversations"];

  private static getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DatabaseManager.DB_NAME, DatabaseManager.VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores if they don't exist
        DatabaseManager.STORES.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
          }
        });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async getDatabase(): Promise<IDBDatabase> {
    return await DatabaseManager.getDB();
  }
}