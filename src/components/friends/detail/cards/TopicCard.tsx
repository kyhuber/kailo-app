// src/components/friends/detail/cards/TopicCard.tsx
import React from 'react';
import { Topic } from '@/utils/topics_storage';

interface TopicCardProps {
  topic: Topic;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  isArchived?: boolean;
}

export default function TopicCard({ topic, onArchive, onRestore, isArchived = false }: TopicCardProps) {
  const dateToShow = isArchived ? topic.updatedAt : topic.createdAt;
  
  return (
    <div className={`p-4 rounded-lg shadow flex justify-between ${
      isArchived ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
    }`}>
      <div>
        <p className={isArchived ? 'text-gray-600 dark:text-gray-300' : ''}>{topic.content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {isArchived ? 'Archived' : 'Added'} on {new Date(dateToShow).toLocaleDateString()}
        </p>
      </div>
      {onArchive && !isArchived && (
        <button 
          onClick={() => onArchive(topic.id)}
          className="text-gray-500 hover:text-gray-700"
        >
          Archive
        </button>
      )}
      {onRestore && isArchived && (
        <button 
          onClick={() => onRestore(topic.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          Restore
        </button>
      )}
    </div>
  );
}