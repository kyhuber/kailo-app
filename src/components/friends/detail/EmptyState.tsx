// src/components/EmptyState.tsx
import React from 'react';

interface EmptyStateProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export default function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center">
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
      <button
        onClick={onAction}
        className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
      >
        {actionLabel}
      </button>
    </div>
  );
}
