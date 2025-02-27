// src/components/friends/detail/cards/TopicCard.tsx
import React from 'react';

interface TopicCardProps<T extends { id: string; status: string; updatedAt: string; createdAt: string, content:string }> {
  item: T;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  isArchived?: boolean;
  isCompleted?: boolean;
  onComplete?: (id: string) => void;
  onReopen?: (id: string) => void;
}

export default function TopicCard<T extends { id: string; status: string; updatedAt: string; createdAt: string, content:string }>({ item, onArchive, onRestore, isArchived = false, isCompleted = false, onComplete, onReopen }: TopicCardProps<T>) {
  const dateToShow = isArchived || isCompleted ? item.updatedAt : item.createdAt;

  return (
    <div className={`p-4 rounded-lg shadow flex justify-between ${
      isArchived ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
    }`}>
      <div>
        <p className={isArchived ? 'text-gray-600 dark:text-gray-300' : ''}>{item.content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {isArchived ? 'Archived' : isCompleted ? 'Completed' : 'Added'} on {new Date(dateToShow).toLocaleDateString()}
        </p>
      </div>
      <div className='flex gap-4'>
        {onComplete && !isArchived && (
          <button
            onClick={() => onComplete(item.id)}
            className="text-green-500 hover:text-green-700"
          >
            Complete
          </button>
        )}
        {onArchive && !isArchived && !isCompleted && (
          <button
            onClick={() => onArchive(item.id)}
            className="text-gray-500 hover:text-gray-700"
          >
            Archive
          </button>
        )}
        {onRestore && isArchived && (
          <button
            onClick={() => onRestore(item.id)}
            className="text-blue-500 hover:text-blue-700"
          >
            Restore
          </button>
        )}
        {onReopen && isCompleted && (
          <button
            onClick={() => onReopen(item.id)}
            className="text-amber-500 hover:text-amber-700"
          >
            Reopen
          </button>
        )}
      </div>
    </div>
  );
}
