// src/utils/friends_storage.ts
import { FirebaseStorage } from './firebase_storage';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

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