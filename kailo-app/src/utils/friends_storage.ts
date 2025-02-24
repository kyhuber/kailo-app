import { DatabaseManager } from "./database";

export class FriendStorage {
  private static STORE_NAME = "friends";

  static async addFriend(friend: { id: string; name: string; contactInfo?: string; tags?: string[] }) {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(FriendStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(FriendStorage.STORE_NAME);
    store.put(friend);
    await new Promise((resolve) => (tx.oncomplete = () => resolve(true)));
    return true;
  }

  static async getFriends() {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FriendStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(FriendStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
