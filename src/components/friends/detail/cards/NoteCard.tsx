// src/components/friends/detail/cards/NoteCard.tsx
import React from 'react';
import { Note } from '@/utils/notes_storage';

interface NoteCardProps {
  note: Note;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  isArchived?: boolean;
}

export default function NoteCard({ note, onArchive, onRestore, isArchived = false }: NoteCardProps) {
  const dateToShow = isArchived ? note.updatedAt : note.createdAt;
  
  return (
    <div className={`p-4 rounded-lg shadow flex justify-between ${
      isArchived ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
    }`}>
      <div>
        <p className={isArchived ? 'text-gray-600 dark:text-gray-300' : ''}>{note.content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {isArchived ? 'Archived' : 'Added'} on {new Date(dateToShow).toLocaleDateString()}
        </p>
      </div>
      {onArchive && !isArchived && (
        <button 
          onClick={() => onArchive(note.id)}
          className="text-gray-500 hover:text-gray-700"
        >
          Archive
        </button>
      )}
      {onRestore && isArchived && (
        <button 
          onClick={() => onRestore(note.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          Restore
        </button>
      )}
    </div>
  );
}