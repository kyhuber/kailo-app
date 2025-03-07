import { db, storage, auth } from '@/lib/firebase';
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ItemStatus } from '@/types/shared';

// Utility function to remove undefined values from an object
const removeUndefinedValues = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
};

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
  async addItem(item: T): Promise<boolean> {
    try {
      const docRef = doc(this.getCollectionRef(), item.id);
      // Remove undefined values before saving to Firestore
      const cleanedItem = removeUndefinedValues(item);
      await setDoc(docRef, cleanedItem);
      return true;
    } catch (error) {
      console.error(`Error adding ${this.collectionName}:`, error);
      return false;
    }
  }

  // Get all items
  async getAll(): Promise<T[]> {
    try {
      const snapshot = await getDocs(this.getCollectionRef());
      return snapshot.docs.map(doc => doc.data() as T);
    } catch (error) {
      console.error(`Error getting all ${this.collectionName}:`, error);
      return [];
    }
  }

  // Get item by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(this.getCollectionRef(), id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? (snapshot.data() as T) : null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      return null;
    }
  }

  // Update item
  async updateItem(item: T): Promise<boolean> {
    try {
      const docRef = doc(this.getCollectionRef(), item.id);
      await updateDoc(docRef, { ...item });
      return true;
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      return false;
    }
  }

  // Delete item
  async deleteItem(id: string): Promise<boolean> {
    try {
      const docRef = doc(this.getCollectionRef(), id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      return false;
    }
  }

  // Query items by field
  async queryByField(field: string, value: any): Promise<T[]> {
    try {
      const q = query(this.getCollectionRef(), where(field, '==', value));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as T);
    } catch (error) {
      console.error(`Error querying ${this.collectionName} by field:`, error);
      return [];
    }
  }
}