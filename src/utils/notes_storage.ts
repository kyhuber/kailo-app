import { DatabaseManager } from "./database";

export interface Note {
  id: string;
  friendId: string;
  content: string;
  status: "Active" | "Archived";
  createdAt: string;
  updatedAt: string;
}

export class NoteStorage {
  private static STORE_NAME = "notes";

  static async addNote(note: Note): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(NoteStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(NoteStorage.STORE_NAME);
    store.put(note);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  static async getNotesByFriend(friendId: string): Promise<Note[]> {
    const db = await DatabaseManager.getDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(NoteStorage.STORE_NAME, "readonly");
      const store = tx.objectStore(NoteStorage.STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const allNotes = request.result as Note[];
        resolve(allNotes.filter(note => note.friendId === friendId));
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async updateNoteStatus(id: string, status: "Active" | "Archived"): Promise<boolean> {
    const db = await DatabaseManager.getDatabase();
    const tx = db.transaction(NoteStorage.STORE_NAME, "readwrite");
    const store = tx.objectStore(NoteStorage.STORE_NAME);
    
    const request = store.get(id);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const note = request.result as Note;
        if (note) {
          note.status = status;
          note.updatedAt = new Date().toISOString();
          store.put(note);
          resolve(true);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => resolve(false);
    });
  }
}