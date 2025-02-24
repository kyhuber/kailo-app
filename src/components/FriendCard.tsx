'use client';

import React from 'react';

interface Friend {
  id: string;
  name: string;
  contactInfo?: string;
  tags?: string[];
}

interface FriendCardProps {
  friend: Friend;
  onDelete: (id: string) => void;
}

export default function FriendCard({ friend, onDelete }: FriendCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{friend.name}</h2>
      {friend.contactInfo && (
        <p className="text-gray-600 dark:text-gray-300 text-sm">{friend.contactInfo}</p>
      )}
      {friend.tags && friend.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {friend.tags.map((tag) => (
            <span key={tag} className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white text-xs font-semibold px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-between">
        <button
          className="text-red-500 hover:text-red-700 text-sm"
          onClick={() => onDelete(friend.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
