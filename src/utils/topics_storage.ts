// src/utils/topics_storage.ts
import { FirebaseStorage } from './firebase_storage';
import { ItemStatus } from '@/types/shared';

export interface Topic {
  id: string;
  friendId: string;
  content: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

class TopicFirebaseStorage extends FirebaseStorage<Topic> {
  constructor() {
    super('topics');
  }

  async getTopicsByFriend(friendId: string): Promise<Topic[]> {
    return this.queryByField('friendId', friendId);
  }

  async updateTopicStatus(id: string, status: ItemStatus): Promise<boolean> {
    const topic = await this.getById(id);
    if (topic) {
      topic.status = status;
      topic.updatedAt = new Date().toISOString();
      return this.updateItem(topic);
    }
    return false;
  }
}