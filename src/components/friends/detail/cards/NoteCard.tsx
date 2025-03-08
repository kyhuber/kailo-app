// src/components/friends/detail/cards/NoteCard.tsx
import React from 'react';
import { Note } from '@/utils/notes_storage';
import { FiEdit2 } from 'react-icons/fi';

interface NoteCardProps {
  note: Note;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onEdit?: () => void;
  isArchived?: boolean;
  onClick?: (note: Note) => void;
}

export default function NoteCard({
  note,
  onArchive,
  onRestore,
  onEdit,
  isArchived = false,
  onClick
}: NoteCardProps) {
  const dateToShow = isArchived ? note.updatedAt : note.createdAt;
  
  return (
    <div 
      className={`p-4 rounded-lg shadow flex justify-between ${
        isArchived ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
      } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750`}
      onClick={() => onClick && onClick(note)}
    >
      <div>
        <p className={isArchived ? 'text-gray-600 dark:text-gray-300' : ''}>{note.content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {isArchived ? 'Archived' : 'Added'} on {new Date(dateToShow).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2">
        {onEdit && !isArchived && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiEdit2 size={16} />
          </button>
        )}
        {onArchive && !isArchived && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onArchive(note.id);
            }}
            className="text-gray-500 hover:text-gray-700 px-2"
          >
            Archive
          </button>
        )}
        {onRestore && isArchived && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRestore(note.id);
            }}
            className="text-blue-500 hover:text-blue-700 px-2"
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
}