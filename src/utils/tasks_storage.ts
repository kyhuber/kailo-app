// src/utils/tasks_storage.ts

export interface Task {
  id: string;
  friendId: string;
  content: string;
  status: 'Active' | 'Archived' | 'Complete' | 'Pending';
  priority: 'Normal' | 'High';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export class TaskStorage {
  private static key = 'tasks';

  static getAll(): Task[] {
    const tasks = localStorage.getItem(this.key);
    return tasks ? JSON.parse(tasks) : [];
  }

  static getByFriendId(friendId: string): Task[] {
    return this.getAll().filter(task => task.friendId === friendId);
  }

  static addTask(task: Task): void {
    const tasks = this.getAll();
    tasks.push(task);
    localStorage.setItem(this.key, JSON.stringify(tasks));
  }

  static async updateTaskStatus(id: string, status: 'Active' | 'Archived' | 'Complete' | 'Pending'): Promise<void> {
    const tasks = this.getAll();
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
      tasks[taskIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(this.key, JSON.stringify(tasks));
    }
  }
}
