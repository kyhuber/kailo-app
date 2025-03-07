// src/components/friends/detail/tabs/FriendNotesTab.tsx
import React, { useState } from 'react';
import { Note, NoteStorage } from '@/utils/notes_storage';
import NoteCard from '../cards/NoteCard';
import AddNoteForm from '../forms/AddNoteForm';
import ManageableItemList from '@/components/shared/ManageableItemList';

interface FriendNotesTabProps {
  friendId: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function FriendNotesTab({ friendId, notes, setNotes }: FriendNotesTabProps) {
  const [isEditingNote, setIsEditingNote] = useState<Note | null>(null);

  const handleEditNote = (note: Note) => {
    setIsEditingNote(note);
  };

  const handleNoteUpdated = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => note.id === updatedNote.id ? updatedNote : note));
    setIsEditingNote(null);
  };

  return (
    <>
      <ManageableItemList<Note>
        title="General Notes"
        description="Notes are general reference information about friends that doesn't change frequently."
        addItemButtonLabel="Add Note"
        items={notes}
        setItems={setNotes}
        CardComponent={({ item, onArchive, isArchived, onRestore }) => (
          <NoteCard 
            note={item}
            onArchive={onArchive}
            onRestore={onRestore}
            onEdit={() => handleEditNote(item)}
            isArchived={isArchived}
          />
        )}
        AddFormComponent={({ isOpen, onClose, onAdded }) => (
          <AddNoteForm
            friendId={friendId}
            isOpen={isOpen}
            onClose={onClose}
            onNoteAdded={onAdded}
          />
        )}
        onUpdateStatus={NoteStorage.updateNoteStatus}
        emptyMessage="No active notes yet. Add some notes to keep track of important information."
      />

      {isEditingNote && (
        <AddNoteForm
          friendId={friendId}
          isOpen={!!isEditingNote}
          onClose={() => setIsEditingNote(null)}
          onNoteAdded={handleNoteUpdated}
          initialData={isEditingNote}
        />
      )}
    </>
  );
}