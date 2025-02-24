import { DatabaseManager } from "./database";

export interface ImportantDate {
  id: string;
  friendId: string;
  title: string;
  date: string;
  type: "Recurring" | "One-time";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export class DateStorage {
  private static STORE_NAME = "dates";

  static async addDate(date: ImportantDate): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(DateStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(DateStorage.STORE_NAME);
    store.put(date);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  static async getDatesByFriend(friendId: string): Promise<ImportantDate[]> {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DateStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(DateStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const allDates = request.result as ImportantDate[];
        if (friendId === "all") {
          resolve(allDates);
        } else {
          resolve(allDates.filter(date => date.friendId === friendId));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async getAllDates(): Promise<ImportantDate[]> {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DateStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(DateStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as ImportantDate[]);
      request.onerror = () => reject(request.error);
    });
  }

  static async updateDate(date: ImportantDate): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(DateStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(DateStorage.STORE_NAME);
    date.updatedAt = new Date().toISOString();
    store.put(date);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }
}