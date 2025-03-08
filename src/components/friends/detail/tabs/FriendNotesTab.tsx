// src/components/friends/detail/tabs/FriendNotesTab.tsx
import React, { useState } from 'react';
import { Note, NoteStorage } from '@/utils/notes_storage';
import { ItemStatus } from '@/types/shared';
import NoteCard from '../cards/NoteCard';
import AddNoteForm from '../forms/AddNoteForm';
import ManageableItemList from '@/components/shared/ManageableItemList';
import ItemDetailModal, { GenericItem } from '@/components/shared/ItemDetailModal';

interface FriendNotesTabProps {
  friendId: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function FriendNotesTab({ friendId, notes, setNotes }: FriendNotesTabProps) {
  const [isEditingNote, setIsEditingNote] = useState<Note | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleEditNote = (note: Note) => {
    setIsEditingNote(note);
  };

  const handleNoteUpdated = (updatedNote: GenericItem) => {
    setNotes(prev => prev.map(note => note.id === updatedNote.id ? updatedNote as Note : note));
    setIsEditingNote(null);
    setSelectedNote(null); // Close detail modal when update completes
  };

  const handleDeleteNote = async (noteId: string) => {
    await NoteStorage.deleteItem(noteId);
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleStatusChange = async (noteId: string, status: string) => {
    await NoteStorage.updateNoteStatus(noteId, status as ItemStatus);
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, status: status as ItemStatus, updatedAt: new Date().toISOString() } 
        : note
    ));
    setSelectedNote(null);
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
            onClick={(note) => setSelectedNote(note)}
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

      {/* Add ItemDetailModal */}
      <ItemDetailModal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        item={selectedNote}
        itemType="note"
        onDelete={handleDeleteNote}
        onUpdate={handleNoteUpdated}
        onStatusChange={handleStatusChange}
        friendId={friendId}
      />

      {isEditingNote && (
        <AddNoteForm
          friendId={friendId}
          isOpen={!!isEditingNote}
          onClose={() => setIsEditingNote(null)}
          onNoteAdded={(note) => {
            setNotes(prev => prev.map(n => n.id === note.id ? note : n));
            setIsEditingNote(null);
          }}
          initialData={isEditingNote}
        />
      )}
    </>
  );
}