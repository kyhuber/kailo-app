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
    const topics = localStorage.getItem(TopicStorage.key); // Changed this.key to TopicStorage.key
    return topics ? JSON.parse(topics) : [];
  }

  static getTopicsByFriend(friendId: string): Topic[] {
    return TopicStorage.getAll().filter(topic => topic.friendId === friendId); // Changed this.getAll() to TopicStorage.getAll()
  }

  static getByFriendId(friendId: string): Topic[] {
    return TopicStorage.getAll().filter(topic => topic.friendId === friendId); // Changed this.getAll() to TopicStorage.getAll()
  }

  static addTopic(topic: Topic): void {
    const topics = TopicStorage.getAll(); // Changed this.getAll() to TopicStorage.getAll()
    topics.push(topic);
    localStorage.setItem(TopicStorage.key, JSON.stringify(topics)); // Changed this.key to TopicStorage.key
  }

  static async updateTopicStatus(id: string, status: 'Active' | 'Archived' | 'Complete' | 'Pending'): Promise<void> {
    const topics = TopicStorage.getAll(); // Changed this.getAll() to TopicStorage.getAll()
    const topicIndex = topics.findIndex(topic => topic.id === id);
    if (topicIndex !== -1) {
      topics[topicIndex].status = status;
      topics[topicIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(TopicStorage.key, JSON.stringify(topics)); // Changed this.key to TopicStorage.key
    }
  }
}
