// src/components/friends/detail/cards/TaskCard.tsx
import React from 'react';
import { Task } from '@/utils/tasks_storage';

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
  onReopen?: (id: string) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  isCompleted?: boolean;
  isArchived?: boolean;
  onClick?: (note: Task) => void;
}

export default function TaskCard({ 
  task, 
  onComplete, 
  onReopen, 
  onArchive, 
  onRestore, 
  isCompleted = false,
  isArchived = false,
  onClick
}: TaskCardProps) {
  const dateToShow = isArchived 
    ? task.updatedAt 
    : isCompleted 
      ? (task.completedAt || task.updatedAt) 
      : task.createdAt;
  
  return (
    <div className={`p-4 rounded-lg shadow flex justify-between ${
      isArchived 
        ? 'bg-gray-100 dark:bg-gray-700' 
        : isCompleted 
          ? 'bg-green-50 dark:bg-green-900' 
          : task.priority === 'High'
            ? 'bg-red-50 dark:bg-red-900 border-l-4 border-red-500'
            : 'bg-white dark:bg-gray-800'
          } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750`}
          onClick={() => onClick && onClick(task)}
        >
      <div>
        <p className={isCompleted ? 'line-through' : ''}>{task.content}</p>
        {!isArchived && !isCompleted && task.priority === 'High' && (
          <span className="text-xs text-red-500 font-semibold">High Priority</span>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {isArchived 
            ? 'Archived' 
            : isCompleted 
              ? 'Completed' 
              : 'Added'} on {new Date(dateToShow).toLocaleDateString()}
        </p>
      </div>
      <div className="flex space-x-2">
        {onComplete && !isCompleted && !isArchived && (
          <button 
            onClick={() => onComplete(task.id)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
          >
            Complete
          </button>
        )}
        {onReopen && isCompleted && !isArchived && (
          <button 
            onClick={() => onReopen(task.id)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Reopen
          </button>
        )}
        {onArchive && !isArchived && (
          <button 
            onClick={() => onArchive(task.id)}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm"
          >
            Archive
          </button>
        )}
        {onRestore && isArchived && (
          <button 
            onClick={() => onRestore(task.id)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
}