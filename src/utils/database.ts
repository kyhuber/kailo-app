import { db } from '@/lib/firebase';
import { Firestore } from 'firebase/firestore';

export class DatabaseManager {
  
  static async getDatabase(): Promise<Firestore> {
    return db; // Return Firestore instance for compatibility
  }
  
  // Add a method to check if the user is using the legacy IndexedDB or new Firebase
  static async isUsingFirebase(): Promise<boolean> {
    return true; // Now always using Firebase
  }
}