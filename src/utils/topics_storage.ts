// src/utils/topics_storage.ts

export interface Topic {
  id: string;
  friendId: string;
  content: string;
  status: 'Active' | 'Archived' | 'Complete' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

export class TopicStorage {
  private static key = 'topics';

  static getAll(): Topic[] {
    const topics = localStorage.getItem(this.key);
    return topics ? JSON.parse(topics) : [];
  }

  static getByFriendId(friendId: string): Topic[] {
    return this.getAll().filter(topic => topic.friendId === friendId);
  }

  static addTopic(topic: Topic): void {
    const topics = this.getAll();
    topics.push(topic);
    localStorage.setItem(this.key, JSON.stringify(topics));
  }

  static async updateTopicStatus(id: string, status: 'Active' | 'Archived' | 'Complete' | 'Pending'): Promise<void> {
    const topics = this.getAll();
    const topicIndex = topics.findIndex(topic => topic.id === id);
    if (topicIndex !== -1) {
      topics[topicIndex].status = status;
      topics[topicIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(this.key, JSON.stringify(topics));
    }
  }
}
