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
    const notes = localStorage.getItem(NoteStorage.key); // Changed this.key to NoteStorage.key
    return notes ? JSON.parse(notes) : [];
  }

  static getNotesByFriend(friendId: string): Note[] {
    return NoteStorage.getAll().filter(note => note.friendId === friendId); // Changed this.getAll() to NoteStorage.getAll()
  }

  static getByFriendId(friendId: string): Note[] {
    return NoteStorage.getAll().filter(note => note.friendId === friendId); // Changed this.getAll() to NoteStorage.getAll()
  }

  static addNote(note: Note): void {
    const notes = NoteStorage.getAll(); // Changed this.getAll() to NoteStorage.getAll()
    notes.push(note);
    localStorage.setItem(NoteStorage.key, JSON.stringify(notes)); // Changed this.key to NoteStorage.key
  }

  static async updateNoteStatus(id: string, status: 'Active' | 'Archived' | 'Complete' | 'Pending'): Promise<void> {
    const notes = NoteStorage.getAll(); // Changed this.getAll() to NoteStorage.getAll()
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      notes[noteIndex].status = status;
      notes[noteIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(NoteStorage.key, JSON.stringify(notes)); // Changed this.key to NoteStorage.key
    }
  }
}
