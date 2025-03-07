// src/utils/dates_storage.ts
import { FirebaseStorage } from './firebase_storage';
import { ItemStatus } from '@/types/shared';

export interface ImportantDate {
  id: string;
  friendId: string;
  title: string;
  date: string;
  endDate?: string;
  type: 'One-time' | 'Recurring';
  description?: string;
  createdAt: string;
  updatedAt: string;
  status?: ItemStatus;
  content?: string;
  userId: string;
}

class DateFirebaseStorage extends FirebaseStorage<ImportantDate> {
  constructor() {
    super('dates');
  }

  async getDatesByFriend(friendId: string): Promise<ImportantDate[]> {
    return this.queryByField('friendId', friendId);
  }

  async updateDate(date: ImportantDate): Promise<boolean> {
    date.updatedAt = new Date().toISOString();
    return this.updateItem(date);
  }
}

export const DateStorage = new DateFirebaseStorage();