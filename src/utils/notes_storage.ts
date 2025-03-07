// src/utils/notes_storage.ts
import { FirebaseStorage } from './firebase_storage';
import { ItemStatus } from '@/types/shared';

export interface Note {
  id: string;
  friendId: string;
  content: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

class NoteFirebaseStorage extends FirebaseStorage<Note> {
  constructor() {
    super('notes');
  }

  async getNotesByFriend(friendId: string): Promise<Note[]> {
    return this.queryByField('friendId', friendId);
  }

  async updateNoteStatus(id: string, status: ItemStatus): Promise<boolean> {
    const note = await this.getById(id);
    if (note) {
      note.status = status;
      note.updatedAt = new Date().toISOString();
      return this.updateItem(note);
    }
    return false;
  }
}

export const NoteStorage = new NoteFirebaseStorage();