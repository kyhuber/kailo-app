// src/utils/notes_storage.ts

export interface Note {
  id: string;
  friendId: string;
  content: string;
  status: 'Active' | 'Archived' | 'Complete' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

export class NoteStorage {
  private static key = 'notes';

  static getAll(): Note[] {
    const notes = localStorage.getItem(this.key);
    return notes ? JSON.parse(notes) : [];
  }

  static getByFriendId(friendId: string): Note[] {
    return this.getAll().filter(note => note.friendId === friendId);
  }

  static addNote(note: Note): void {
    const notes = this.getAll();
    notes.push(note);
    localStorage.setItem(this.key, JSON.stringify(notes));
  }

  static async updateNoteStatus(id: string, status: 'Active' | 'Archived' | 'Complete' | 'Pending'): Promise<void> {
    const notes = this.getAll();
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      notes[noteIndex].status = status;
      notes[noteIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(this.key, JSON.stringify(notes));
    }
  }
}
