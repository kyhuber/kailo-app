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
    const tasks = localStorage.getItem(TaskStorage.key); // Changed this.key to TaskStorage.key
    return tasks ? JSON.parse(tasks) : [];
  }

  static getTasksByFriend(friendId: string): Task[] {
    return TaskStorage.getAll().filter(task => task.friendId === friendId); // Changed this.getAll() to TaskStorage.getAll()
  }

  static getByFriendId(friendId: string): Task[] {
    return TaskStorage.getAll().filter(task => task.friendId === friendId); // Changed this.getAll() to TaskStorage.getAll()
  }

  static addTask(task: Task): void {
    const tasks = TaskStorage.getAll(); // Changed this.getAll() to TaskStorage.getAll()
    tasks.push(task);
    localStorage.setItem(TaskStorage.key, JSON.stringify(tasks)); // Changed this.key to TaskStorage.key
  }

  static async updateTaskStatus(id: string, status: 'Active' | 'Archived' | 'Complete' | 'Pending'): Promise<void> {
    const tasks = TaskStorage.getAll(); // Changed this.getAll() to TaskStorage.getAll()
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
      tasks[taskIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(TaskStorage.key, JSON.stringify(tasks)); // Changed this.key to TaskStorage.key
    }
  }
}
