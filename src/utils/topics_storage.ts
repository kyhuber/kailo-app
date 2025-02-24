import { DatabaseManager } from "./database";

export interface Topic {
  id: string;
  friendId: string;
  content: string;
  status: "Active" | "Archived";
  createdAt: string;
  updatedAt: string;
}

export class TopicStorage {
  private static STORE_NAME = "topics";

  static async addTopic(topic: Topic): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(TopicStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(TopicStorage.STORE_NAME);
    store.put(topic);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  static async getTopicsByFriend(friendId: string): Promise<Topic[]> {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TopicStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(TopicStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const allTopics = request.result as Topic[];
        if (friendId === "all") {
          resolve(allTopics);
        } else {
          resolve(allTopics.filter(topic => topic.friendId === friendId));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async updateTopic(topic: Topic): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(TopicStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(TopicStorage.STORE_NAME);
    
    topic.updatedAt = new Date().toISOString();
    store.put(topic);
    
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  static async updateTopicStatus(id: string, status: "Active" | "Archived"): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(TopicStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(TopicStorage.STORE_NAME);
    
    const request = store.get(id);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const topic = request.result as Topic;
        if (topic) {
          topic.status = status;
          topic.updatedAt = new Date().toISOString();
          store.put(topic);
          resolve(true);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => resolve(false);
    });
  }
}