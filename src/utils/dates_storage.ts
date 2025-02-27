// src/utils/dates_storage.ts

export interface ImportantDate {
  id: string;
  friendId: string;
  title: string;
  date: string;
  type: 'One-time' | 'Recurring';
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: 'Active' | 'Archived' | 'Complete' | 'Pending'; // Added status property
  content?:string;
}

export class DateStorage {
  private static key = 'dates';

  static getAll(): ImportantDate[] {
    const dates = localStorage.getItem(DateStorage.key);
    return dates ? JSON.parse(dates) : [];
  }

  static getDatesByFriend(friendId: string): ImportantDate[] {
    return DateStorage.getAll().filter(date => date.friendId === friendId);
  }

  static getByFriendId(friendId: string): ImportantDate[] {
    return DateStorage.getAll().filter(date => date.friendId === friendId);
  }

  static addDate(date: ImportantDate): void {
    const dates = DateStorage.getAll();
    dates.push(date);
    localStorage.setItem(DateStorage.key, JSON.stringify(dates));
  }
  
  static async updateDate(date: ImportantDate): Promise<void> {
    const dates = DateStorage.getAll();
    const dateIndex = dates.findIndex(item => item.id === date.id);
    if (dateIndex !== -1) {
      dates[dateIndex] = date;
      dates[dateIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(DateStorage.key, JSON.stringify(dates));
    }
  }
}
