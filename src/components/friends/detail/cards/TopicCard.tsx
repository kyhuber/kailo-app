// src/components/friends/detail/cards/TopicCard.tsx
import React from 'react';
import { AiOutlineInbox, AiOutlineCloudUpload } from 'react-icons/ai';

interface TopicCardProps<T extends { id: string; status: string; updatedAt: string; createdAt: string, content?: string; priority?: string }> {
  item: T;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  isArchived?: boolean;
  isCompleted?: boolean;
  onComplete?: (id: string) => void;
  onReopen?: (id: string) => void;
  onClick?: (item: T) => void;
}

export default function TopicCard<T extends { id: string; status: string; updatedAt: string; createdAt: string, content?: string; priority?: string }>({ 
  item, 
  onArchive, 
  onRestore, 
  isArchived = false, 
  isCompleted = false, 
  onComplete, 
  onReopen,
  onClick
}: TopicCardProps<T>) {
  const dateToShow = isArchived || isCompleted ? item.updatedAt : item.createdAt;
  const isPriority = 'priority' in item && item.priority === 'High';

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const handleButtonClick = (e: React.MouseEvent, callback: (id: string) => void) => {
    e.stopPropagation();
    callback(item.id);
  };

  return (
    <div 
      className={`p-4 rounded-lg shadow flex justify-between items-center ${
        (isArchived ?? false) 
          ? 'bg-gray-100 dark:bg-gray-700' 
          : (isCompleted ?? false)
          ? 'bg-green-50 dark:bg-green-900/30'
          : isPriority
          ? 'bg-white dark:bg-gray-800 border-l-4 border-red-500'
          : 'bg-white dark:bg-gray-800'
      } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750`}
      onClick={handleClick}
    >
      <div>
        <div className='flex items-center gap-2 my-1'>
          <p className={`text-sm ${
            (isArchived ?? false) 
              ? 'text-gray-600 dark:text-gray-300' 
              : (isCompleted ?? false)
              ? 'line-through text-gray-600 dark:text-gray-300'
              : ''
          }`}>
            {item.content}
          </p>
          {isPriority && !isCompleted && !isArchived && (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded dark:bg-red-900/50 dark:text-red-200">
              High Priority
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {isArchived ? 'Archived' : isCompleted ? 'Completed' : 'Added'} on {new Date(dateToShow).toLocaleDateString()}
        </p>
      </div>
      <div className='flex gap-2'>
        {onComplete && !isArchived && !isCompleted && (
          <button
            onClick={(e) => handleButtonClick(e, onComplete)}
            className="text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 px-3 py-1 rounded-md text-sm"
          >
            Complete
          </button>
        )}
        {onArchive && !isArchived && (
          <button
            onClick={(e) => handleButtonClick(e, onArchive)}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded-md text-sm flex items-center gap-1"
          >
            <AiOutlineInbox size={16}/> Archive
          </button>
        )}
        {onRestore && isArchived && (
          <button
            onClick={(e) => handleButtonClick(e, onRestore)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-3 py-1 rounded-md text-sm flex items-center gap-1"
          >
            <AiOutlineCloudUpload size={16}/> Restore
          </button>
        )}
        {onReopen && isCompleted && (
          <button
            onClick={(e) => handleButtonClick(e, onReopen)}
            className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 px-3 py-1 rounded-md text-sm"
          >
            Reopen
          </button>
        )}
      </div>
    </div>
  );
}