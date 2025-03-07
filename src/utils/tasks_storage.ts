// src/utils/tasks_storage.ts
import { FirebaseStorage } from './firebase_storage';
import { ItemStatus } from '@/types/shared';

export interface Task {
  id: string;
  friendId: string;
  content: string;
  status: ItemStatus;
  priority: 'Normal' | 'High';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  userId: string;
}

class TaskFirebaseStorage extends FirebaseStorage<Task> {
  constructor() {
    super('tasks');
  }

  async getTasksByFriend(friendId: string): Promise<Task[]> {
    return this.queryByField('friendId', friendId);
  }

  async updateTaskStatus(id: string, status: ItemStatus): Promise<boolean> {
    const task = await this.getById(id);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
      if (status === 'Complete') {
        task.completedAt = new Date().toISOString();
      }
      return this.updateItem(task);
    }
    return false;
  }
}

export const TaskStorage = new TaskFirebaseStorage();