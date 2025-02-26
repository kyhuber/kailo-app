// src/components/friends/detail/EmptyState.tsx
import React, { ReactNode } from 'react';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export default function EmptyState({ message, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
      {icon && <div className="flex justify-center mb-2">{icon}</div>}
      <p className="text-gray-600 dark:text-gray-400 mb-2">{message}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction} 
          className="text-blue-500 text-sm font-medium hover:text-blue-600"
        >
          {actionLabel} +
        </button>
      )}
    </div>
  );
}