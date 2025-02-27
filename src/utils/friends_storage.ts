// src/utils/friends_storage.ts
import { DatabaseManager } from "./database";

export interface Friend {
  id: string;
  name: string;
  contactInfo?: string;
  tags?: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
  pendingTasksCount?: number;
  upcomingDatesCount?: number;
}

export class FriendStorage {
  private static STORE_NAME = "friends";

  static async addFriend(friend: Friend): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(FriendStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(FriendStorage.STORE_NAME);
    store.put(friend);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  static async getAll(): Promise<Friend[]> {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FriendStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(FriendStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as Friend[]);
      request.onerror = () => reject(request.error);
    });
  }

  static async getFriend(id: string): Promise<Friend | null> {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FriendStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(FriendStorage.STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async updateFriend(friend: Friend): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(FriendStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(FriendStorage.STORE_NAME);
    friend.updatedAt = new Date().toISOString();
    store.put(friend);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  static async deleteFriend(id: string): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(FriendStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(FriendStorage.STORE_NAME);
    store.delete(id);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }
}
