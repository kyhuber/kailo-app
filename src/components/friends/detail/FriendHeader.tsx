import React from 'react';
import { Friend } from '@/utils/friends_storage';

interface FriendHeaderProps {
  friend: Friend;
}

export default function FriendHeader({ friend }: FriendHeaderProps) {
  return (
    <div className={`p-6 rounded-lg shadow-md mb-6 ${
      friend.color || 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
    }`}>
      {friend.photoUrl && (
        <div className="mb-4">
          <img 
            src={friend.photoUrl} 
            alt={`${friend.name}'s photo`} 
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {friend.name}
      </h1>
      {friend.contactInfo && (
        <p className="text-gray-800 dark:text-gray-100 mt-2">
          {friend.contactInfo}
        </p>
      )}
      {friend.tags && friend.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {friend.tags.map((tag) => (
            <span 
              key={tag} 
              className="bg-white bg-opacity-70 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-800 dark:text-gray-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}