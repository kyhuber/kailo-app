// src/components/friends/detail/cards/TopicCard.tsx
import React from 'react';
import { AiOutlineInbox, AiOutlineCloudUpload } from 'react-icons/ai';

interface TopicCardProps<T extends { id: string; status: string; updatedAt: string; createdAt: string, content?: string }> {
  item: T;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  isArchived?: boolean;
  isCompleted?: boolean;
  onComplete?: (id: string) => void;
  onReopen?: (id: string) => void;
  onClick?: (item: T) => void;
}

export default function TopicCard<T extends { id: string; status: string; updatedAt: string; createdAt: string, content?: string }>({ 
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
        (isArchived ?? false) ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
      } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750`}
      onClick={handleClick}
    >
      <div>
        <div className='flex items-center gap-2 my-1'>
          <p className={`text-sm ${(isArchived ?? false) ? 'text-gray-600 dark:text-gray-300' : ''}`}>{item.content}</p>
          {item.status === 'Active' && <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">Active</span>}
          {item.status === 'Archived' && <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded">Archived</span>}
          {item.status === 'Complete' && <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">Completed</span>}
          {item.status === 'Pending' && <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">Pending</span>}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {isArchived ? 'Archived' : isCompleted ? 'Completed' : 'Added'} on {new Date(dateToShow).toLocaleDateString()}
        </p>
      </div>
      <div className='flex gap-4'>
        {onComplete && !isArchived && (
          <button
            onClick={(e) => handleButtonClick(e, onComplete)}
            className="text-green-500 hover:text-green-700 mx-1 flex items-center gap-1"
          >
            Complete
          </button>
        )}
        {onArchive && !isArchived && !isCompleted && (
          <button
            onClick={(e) => handleButtonClick(e, onArchive)}
            className="text-gray-500 hover:text-gray-700 mx-1 flex items-center gap-1"
          >
            <AiOutlineInbox size={16}/> Archive
          </button>
        )}
        {onRestore && isArchived && (
          <button
            onClick={(e) => handleButtonClick(e, onRestore)}
            className="text-blue-500 hover:text-blue-700 mx-1 flex items-center gap-1"
          >
            <AiOutlineCloudUpload size={16}/> Restore
          </button>
        )}
        {onReopen && isCompleted && (
          <button
            onClick={(e) => handleButtonClick(e, onReopen)}
            className="text-amber-500 hover:text-amber-700 mx-1 flex items-center gap-1"
          >
            Reopen
          </button>
        )}
      </div>
    </div>
  );
}