import { DatabaseManager } from "./database";

export interface Task {
  id: string;
  friendId: string;
  content: string;
  status: "Pending" | "Complete" | "Archived";
  priority: "Normal" | "High";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export class TaskStorage {
  private static STORE_NAME = "tasks";

  static async addTask(task: Task): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(TaskStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(TaskStorage.STORE_NAME);
    store.put(task);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  static async getTasksByFriend(friendId: string): Promise<Task[]> {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TaskStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(TaskStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const allTasks = request.result as Task[];
        if (friendId === "all") {
          resolve(allTasks);
        } else {
          resolve(allTasks.filter(task => task.friendId === friendId));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async updateTaskStatus(id: string, status: "Pending" | "Complete" | "Archived"): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(TaskStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(TaskStorage.STORE_NAME);
    
    const request = store.get(id);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const task = request.result as Task;
        if (task) {
          task.status = status;
          task.updatedAt = new Date().toISOString();
          
          if (status === "Complete") {
            task.completedAt = new Date().toISOString();
          }
          
          store.put(task);
          resolve(true);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => resolve(false);
    });
  }

  static async updateTaskPriority(id: string, priority: "Normal" | "High"): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(TaskStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(TaskStorage.STORE_NAME);
    
    const request = store.get(id);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const task = request.result as Task;
        if (task) {
          task.priority = priority;
          task.updatedAt = new Date().toISOString();
          store.put(task);
          resolve(true);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => resolve(false);
    });
  }
}