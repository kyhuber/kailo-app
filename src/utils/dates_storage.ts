import { DatabaseManager } from "./database";

export class DateStorage {
  private static STORE_NAME = "dates";

  static async addDate(date: { id: string; friendId: string; title: string; date: string }) {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(DateStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(DateStorage.STORE_NAME);
    store.put(date);
    await new Promise((resolve) => (tx.oncomplete = () => resolve(true)));
    return true;
  }

  static async getDatesByFriend(friendId: string) {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DateStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(DateStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const allDates = request.result;
        resolve(allDates.filter(date => date.friendId === friendId));
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async getAllDates() {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DateStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(DateStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
