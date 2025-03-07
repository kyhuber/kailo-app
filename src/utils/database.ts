// src/utils/database.ts
import { db } from '@/lib/firebase';

export class DatabaseManager {
  // This class is now a compatibility layer for legacy code
  // Most functionality has been moved to individual Firebase storage classes
  
  static async getDatabase(): Promise<any> {
    return db; // Return Firestore instance for compatibility
  }
  
  // Add a method to check if the user is using the legacy IndexedDB or new Firebase
  static async isUsingFirebase(): Promise<boolean> {
    return true; // Now always using Firebase
  }
}