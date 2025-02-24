'use client';

import React from 'react';
import Link from 'next/link';

interface Friend {
  id: string;
  name: string;
  contactInfo?: string;
  tags?: string[];
  color?: string;
}

interface FriendCardProps {
  friend: Friend;
  onDelete: (id: string) => void;
  pendingTasksCount?: number;
  upcomingDatesCount?: number;
}

export default function FriendCard({ friend, onDelete, pendingTasksCount = 0, upcomingDatesCount = 0 }: FriendCardProps) {
  // Generate initials for the avatar
  const initials = friend.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const baseColors = {
    'bg-teal-100': 'text-teal-800 bg-teal-50 border-teal-200',
    'bg-amber-100': 'text-amber-800 bg-amber-50 border-amber-200',
    'bg-rose-100': 'text-rose-800 bg-rose-50 border-rose-200',
    'bg-violet-100': 'text-violet-800 bg-violet-50 border-violet-200',
    'bg-emerald-100': 'text-emerald-800 bg-emerald-50 border-emerald-200',
    'bg-blue-100': 'text-blue-800 bg-blue-50 border-blue-200',
  };

  // Get the correct text/background colors based on the friend's color
  const colorClasses = friend.color ? baseColors[friend.color as keyof typeof baseColors] || baseColors['bg-teal-100'] : baseColors['bg-teal-100'];

  return (
    <Link href={`/friends/${friend.id}`} className="block transition transform hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className={`p-5 relative`}>
          {/* Avatar with Initials */}
          <div className="flex items-center mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-3 ${colorClasses}`}>
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-0">{friend.name}</h2>
              {friend.contactInfo && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5 mb-0">{friend.contactInfo}</p>
              )}
            </div>
          </div>

          {friend.tags && friend.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {friend.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-750 p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${pendingTasksCount > 0 ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
              <span className={pendingTasksCount > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
                {pendingTasksCount} task{pendingTasksCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${upcomingDatesCount > 0 ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
              <span className={upcomingDatesCount > 0 ? "text-teal-600 dark:text-teal-400 font-medium" : ""}>
                {upcomingDatesCount} date{upcomingDatesCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              e.stopPropagation(); // Prevent event bubbling
              onDelete(friend.id);
            }}
            className="text-rose-500 hover:text-rose-700 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Link>
  );
}