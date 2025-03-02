import { DatabaseManager } from "./database";

export interface Conversation {
  id: string;
  friendId: string;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export class ConversationStorage {
  private static STORE_NAME = "conversations";

  static async addConversation(conversation: Conversation): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(ConversationStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(ConversationStorage.STORE_NAME);
    store.put(conversation);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  static async getConversationsByFriend(friendId: string): Promise<Conversation[]> {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(ConversationStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(ConversationStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const allConversations = request.result as Conversation[];
        resolve(allConversations.filter(conv => conv.friendId === friendId));
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async updateConversation(conversation: Conversation): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(ConversationStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(ConversationStorage.STORE_NAME);
    conversation.updatedAt = new Date().toISOString();
    store.put(conversation);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }
}