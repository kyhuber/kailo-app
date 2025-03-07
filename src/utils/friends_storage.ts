import { FirebaseStorage } from './firebase_storage';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export interface Friend {
  id: string;
  name: string;
  contactInfo?: string;
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
      const photoRef = ref(storage, `users/${userId}/friends/${friendId}/${uuidv4()}.jpg`);
      
      await uploadBytes(photoRef, photoFile);
      const photoUrl = await getDownloadURL(photoRef);
      
      // Update friend with photo URL
      const friend = await this.getById(friendId);
      if (friend) {
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
      const userId = this.getUserId();
      const photoRef = ref(storage, `users/${userId}/friends/${friendId}/photo.jpg`);
      await deleteObject(photoRef);
      
      // Update friend to remove photo URL
      const friend = await this.getById(friendId);
      if (friend) {
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