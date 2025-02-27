// src/components/friends/detail/tabs/FriendNotesTab.tsx
import React from 'react';
import { Note, NoteStorage } from '@/utils/notes_storage';
import TopicCard from '../cards/TopicCard'; // updated import name
import AddNoteForm from '../forms/AddNoteForm';
import ManageableItemList from '@/components/shared/ManageableItemList';

interface FriendNotesTabProps {
  friendId: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function FriendNotesTab({ friendId, notes, setNotes }: FriendNotesTabProps) {

  return (
    <ManageableItemList<Note>
      title="General Notes"
      description="Notes are general reference information about friends that doesn't change frequently."
      addItemButtonLabel="Add Note"
      items={notes}
      setItems={setNotes}
      CardComponent={TopicCard} // updated CardComponent to TopicCard
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
  );
}
