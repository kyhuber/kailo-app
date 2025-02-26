// src/components/friends/detail/tabs/FriendNotesTab.tsx
import React from 'react';
import { Note, NoteStorage } from '@/utils/notes_storage';
import NoteCard from '../cards/NoteCard';
import AddNoteForm from '../forms/AddNoteForm';

interface FriendNotesTabProps {
  friendId: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function FriendNotesTab({ friendId, notes, setNotes }: FriendNotesTabProps) {
  const activeNotes = notes.filter(note => note.status === 'Active');
  const archivedNotes = notes.filter(note => note.status === 'Archived');

  const handleAddNote = (newNote: Note) => {
    setNotes(prev => [...prev, newNote]);
  };

  const handleArchiveNote = async (noteId: string) => {
    await NoteStorage.updateNoteStatus(noteId, 'Archived');
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, status: 'Archived', updatedAt: new Date().toISOString() } : note
    ));
  };

  const handleRestoreNote = async (noteId: string) => {
    await NoteStorage.updateNoteStatus(noteId, 'Active');
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, status: 'Active', updatedAt: new Date().toISOString() } : note
    ));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">General Notes</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Notes are general reference information about friends that doesn&#39;t change frequently.
      </p>
      
      {/* Add Note Form */}
      <AddNoteForm friendId={friendId} onNoteAdded={handleAddNote} />

      {/* Active Notes */}
      <h3 className="font-medium text-lg mb-2">Active Notes</h3>
      {activeNotes.length > 0 ? (
        <div className="space-y-3 mb-6">
          {activeNotes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onArchive={handleArchiveNote} 
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">No active notes yet.</p>
      )}

      {/* Archived Notes */}
      <h3 className="font-medium text-lg mb-2">Archived Notes</h3>
      {archivedNotes.length > 0 ? (
        <div className="space-y-3">
          {archivedNotes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onRestore={handleRestoreNote}
              isArchived
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No archived notes.</p>
      )}
    </div>
  );
}