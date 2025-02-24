import { DatabaseManager } from "./database";

export class TopicStorage {
  private static STORE_NAME = "topics";

  static async addTopic(topic: { 
    id: string; 
    friendId: string; 
    content: string; 
    type: "general" | "action"; 
    status?: "Pending" | "Complete"; 
    createdAt: string; 
  }) {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(TopicStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(TopicStorage.STORE_NAME);
    store.put(topic);
    await new Promise((resolve) => (tx.oncomplete = () => resolve(true)));
    return true;
  }

  static async getTopicsByFriend(friendId: string) {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TopicStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(TopicStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const allTopics = request.result as { 
          id: string; 
          friendId: string; 
          content: string; 
          type: "general" | "action"; 
          status?: "Pending" | "Complete"; 
          createdAt: string; 
        }[];
        resolve(allTopics.filter(topic => topic.friendId === friendId));
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async updateTopicStatus(id: string, newStatus: "Pending" | "Complete") {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(TopicStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(TopicStorage.STORE_NAME);
    
    const request = store.get(id);
    request.onsuccess = () => {
      const topic = request.result;
      if (topic && topic.type === "action") {
        topic.status = newStatus;
        store.put(topic);
      }
    };
    await new Promise((resolve) => (tx.oncomplete = () => resolve(true)));
    return true;
  }
}
