// src/utils/firebase_storage.ts
import { db, storage, auth } from '@/utils/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Base class for all Firebase storage
export class FirebaseStorage<T extends { id: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Get user ID from auth
  protected getUserId() {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    return user.uid;
  }

  // Get collection reference with user ID
  protected getCollectionRef() {
    const userId = this.getUserId();
    return collection(db, `users/${userId}/${this.collectionName}`);
  }

  // Add or update item
  async addItem(item: T): Promise<void> {
    const docRef = doc(this.getCollectionRef(), item.id);
    await setDoc(docRef, item);
  }

  // Get all items
  async getAll(): Promise<T[]> {
    const snapshot = await getDocs(this.getCollectionRef());
    return snapshot.docs.map(doc => doc.data() as T);
  }

  // Get item by ID
  async getById(id: string): Promise<T | null> {
    const docRef = doc(this.getCollectionRef(), id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? (snapshot.data() as T) : null;
  }

  // Update item
  async updateItem(item: T): Promise<void> {
    const docRef = doc(this.getCollectionRef(), item.id);
    await updateDoc(docRef, { ...item });
  }

  // Delete item
  async deleteItem(id: string): Promise<void> {
    const docRef = doc(this.getCollectionRef(), id);
    await deleteDoc(docRef);
  }

  // Query items by field
  async queryByField(field: string, value: any): Promise<T[]> {
    const q = query(this.getCollectionRef(), where(field, '==', value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as T);
  }
}

export class FriendFirebaseStorage extends FirebaseStorage<Friend> {
  constructor() {
    super('friends');
  }

  async uploadPhoto(friendId: string, photoFile: File): Promise<string> {
    const userId = this.getUserId();
    const photoRef = ref(storage, `users/${userId}/friends/${friendId}/photo.jpg`);
    
    await uploadBytes(photoRef, photoFile);
    const photoUrl = await getDownloadURL(photoRef);
    
    // Update friend with photo URL
    const friend = await this.getById(friendId);
    if (friend) {
      friend.photoUrl = photoUrl;
      await this.updateItem(friend);
    }
    
    return photoUrl;
  }
}

// Note storage
export class NoteFirebaseStorage extends FirebaseStorage<Note> {
    constructor() {
      super('notes');
    }
  
    // Get notes by friend ID
    async getNotesByFriend(friendId: string): Promise<Note[]> {
      return this.queryByField('friendId', friendId);
    }
  
    // Update note status
    async updateNoteStatus(id: string, status: 'Active' | 'Archived' | 'Complete' | 'Pending'): Promise<void> {
      const note = await this.getById(id);
      if (note) {
        note.status = status;
        note.updatedAt = new Date().toISOString();
        await this.updateItem(note);
      }
    }
  }
  
  // Topic storage
  export class TopicFirebaseStorage extends FirebaseStorage<Topic> {
    constructor() {
      super('topics');
    }
  
    // Get topics by friend ID
    async getTopicsByFriend(friendId: string): Promise<Topic[]> {
      return this.queryByField('friendId', friendId);
    }
  
    // Update topic status
    async updateTopicStatus(id: string, status: 'Active' | 'Archived' | 'Complete' | 'Pending'): Promise<void> {
      const topic = await this.getById(id);
      if (topic) {
        topic.status = status;
        topic.updatedAt = new Date().toISOString();
        await this.updateItem(topic);
      }
    }
  }
  
  // Task storage
  export class TaskFirebaseStorage extends FirebaseStorage<Task> {
    constructor() {
      super('tasks');
    }
  
    // Get tasks by friend ID
    async getTasksByFriend(friendId: string): Promise<Task[]> {
      return this.queryByField('friendId', friendId);
    }
  
    // Update task status
    async updateTaskStatus(id: string, status: 'Active' | 'Archived' | 'Complete' | 'Pending'): Promise<void> {
      const task = await this.getById(id);
      if (task) {
        task.status = status;
        task.updatedAt = new Date().toISOString();
        if (status === 'Complete') {
          task.completedAt = new Date().toISOString();
        }
        await this.updateItem(task);
      }
    }
  }
  
  // Date storage
  export class DateFirebaseStorage extends FirebaseStorage<ImportantDate> {
    constructor() {
      super('dates');
    }
  
    // Get dates by friend ID
    async getDatesByFriend(friendId: string): Promise<ImportantDate[]> {
      return this.queryByField('friendId', friendId);
    }
  
    // Update date
    async updateDate(date: ImportantDate): Promise<void> {
      date.updatedAt = new Date().toISOString();
      await this.updateItem(date);
    }
  }
  
  // Conversation storage
  export class ConversationFirebaseStorage extends FirebaseStorage<Conversation> {
    constructor() {
      super('conversations');
    }
  
    // Get conversations by friend ID
    async getConversationsByFriend(friendId: string): Promise<Conversation[]> {
      return this.queryByField('friendId', friendId);
    }
  
    // Add voice note to conversation
    async addVoiceNote(conversationId: string, audioBlob: Blob): Promise<string> {
      const userId = this.getUserId();
      const fileName = `voice-note-${Date.now()}.webm`;
      const audioRef = ref(storage, `users/${userId}/conversations/${conversationId}/${fileName}`);
      
      await uploadBytes(audioRef, audioBlob);
      const audioUrl = await getDownloadURL(audioRef);
      
      // Update conversation with audio URL
      const conversation = await this.getById(conversationId);
      if (conversation) {
        if (!conversation.voiceNotes) {
          conversation.voiceNotes = [];
        }
        conversation.voiceNotes.push({
          id: crypto.randomUUID(),
          url: audioUrl,
          createdAt: new Date().toISOString()
        });
        conversation.updatedAt = new Date().toISOString();
        await this.updateItem(conversation);
      }
      
      return audioUrl;
    }
  }