// src/components/friends/detail/tabs/FriendNotesTab.tsx
import React, { useState } from 'react';
import { Note, NoteStorage } from '@/utils/notes_storage';
import NoteCard from '../cards/NoteCard';
import AddNoteForm from '../forms/AddNoteForm';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface FriendNotesTabProps {
  friendId: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function FriendNotesTab({ friendId, notes, setNotes }: FriendNotesTabProps) {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [noteToArchive, setNoteToArchive] = useState<string | null>(null);
  const [noteToRestore, setNoteToRestore] = useState<string | null>(null);
  
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
    setNoteToArchive(null);
  };

  const handleRestoreNote = async (noteId: string) => {
    await NoteStorage.updateNoteStatus(noteId, 'Active');
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, status: 'Active', updatedAt: new Date().toISOString() } : note
    ));
    setNoteToRestore(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">General Notes</h2>
        <button 
          onClick={() => setIsAddNoteModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Add Note
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Notes are general reference information about friends that doesn&#39;t change frequently.
      </p>
      
      {/* Active Notes */}
      <h3 className="font-medium text-lg mb-3">Active Notes</h3>
      {activeNotes.length > 0 ? (
        <div className="space-y-3 mb-6">
          {activeNotes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onArchive={() => setNoteToArchive(note.id)} 
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          No active notes yet. Add some notes to keep track of important information.
        </p>
      )}

      {/* Archived Notes */}
      {archivedNotes.length > 0 && (
        <>
          <h3 className="font-medium text-lg mb-3">Archived Notes</h3>
          <div className="space-y-3">
            {archivedNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onRestore={() => setNoteToRestore(note.id)}
                isArchived
              />
            ))}
          </div>
        </>
      )}
      
      {/* Modals */}
      <AddNoteForm 
        friendId={friendId} 
        onNoteAdded={handleAddNote} 
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
      />
      
      <ConfirmModal
        isOpen={!!noteToArchive}
        onClose={() => setNoteToArchive(null)}
        onConfirm={() => noteToArchive && handleArchiveNote(noteToArchive)}
        title="Archive Note"
        message="Are you sure you want to archive this note? You can restore it later if needed."
        confirmButtonText="Archive"
        variant="warning"
      />
      
      <ConfirmModal
        isOpen={!!noteToRestore}
        onClose={() => setNoteToRestore(null)}
        onConfirm={() => noteToRestore && handleRestoreNote(noteToRestore)}
        title="Restore Note"
        message="Do you want to restore this note to active status?"
        confirmButtonText="Restore"
        variant="info"
      />
    </div>
  );
}