// src/utils/friends_storage.ts
import { FirebaseStorage } from './firebase_storage';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { TaskStorage } from './tasks_storage';
import { NoteStorage } from './notes_storage';
import { TopicStorage } from './topics_storage';
import { DateStorage } from './dates_storage';

export interface Friend {
  id: string;
  name: string;
  contactInfo?: string;
  contactDetails?: {
    email?: string;
    phone?: string;
  };
  tags?: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
  pendingTasksCount?: number;
  upcomingDatesCount?: number;
  photoUrl?: string;
  userId: string;
}

class FriendFirebaseStorage extends FirebaseStorage<Friend> {
  constructor() {
    super('friends');
  }

  async uploadPhoto(friendId: string, photoFile: File): Promise<string | null> {
    try {
      const userId = this.getUserId();
      
      // Generate a unique filename 
      const filename = `${friendId}_${Date.now()}.jpg`;
      const photoRef = ref(storage, `users/${userId}/friends/${filename}`);
      
      // Upload the file
      await uploadBytes(photoRef, photoFile);
      const photoUrl = await getDownloadURL(photoRef);
      
      // Update friend with photo URL
      const friend = await this.getById(friendId);
      if (friend) {
        // Delete existing photo if it exists
        if (friend.photoUrl) {
          try {
            const existingPhotoRef = ref(storage, friend.photoUrl);
            await deleteObject(existingPhotoRef);
          } catch (deleteError) {
            console.warn("Could not delete existing photo:", deleteError);
          }
        }

        friend.photoUrl = photoUrl;
        await this.updateItem(friend);
      }
      
      return photoUrl;
    } catch (error) {
      console.error("Error uploading photo:", error);
      return null;
    }
  }

  async deleteFriendWithRecords(friendId: string): Promise<boolean> {
    try {
      // First, delete all associated records
      
      // Delete tasks
      const tasks = await TaskStorage.getTasksByFriend(friendId);
      for (const task of tasks) {
        await TaskStorage.deleteItem(task.id);
      }
      
      // Delete notes
      const notes = await NoteStorage.getNotesByFriend(friendId);
      for (const note of notes) {
        await NoteStorage.deleteItem(note.id);
      }
      
      // Delete topics
      const topics = await TopicStorage.getTopicsByFriend(friendId);
      for (const topic of topics) {
        await TopicStorage.deleteItem(topic.id);
      }
      
      // Delete dates
      const dates = await DateStorage.getDatesByFriend(friendId);
      for (const date of dates) {
        await DateStorage.deleteItem(date.id);
      }
      
      // Delete the photo if it exists
      await this.deletePhoto(friendId);
      
      // Finally, delete the friend
      await this.deleteItem(friendId);
      
      return true;
    } catch (error) {
      console.error("Error in cascading delete:", error);
      throw error;
    }
  }

  async deletePhoto(friendId: string): Promise<boolean> {
    try {
      const friend = await this.getById(friendId);
      if (friend && friend.photoUrl) {
        // Delete from storage
        const photoRef = ref(storage, friend.photoUrl);
        await deleteObject(photoRef);
        
        // Remove photoUrl from friend record
        delete friend.photoUrl;
        await this.updateItem(friend);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting photo:", error);
      return false;
    }
  }
}

export const FriendStorage = new FriendFirebaseStorage();