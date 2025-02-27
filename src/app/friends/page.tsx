// src/app/friends/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { TaskStorage } from '@/utils/tasks_storage';
import { DateStorage } from '@/utils/dates_storage';
import { AddFriendButton } from '@/components/friends/AddFriendButton';

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadFriends() {
      try {
        const storedFriends = await FriendStorage.getFriends();
        setFriends(Array.isArray(storedFriends) ? storedFriends : []);
      } catch (error) {
        console.error("Error loading friends data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFriends();
  }, []);

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleDeleteFriend(friendId: string) {
    if (window.confirm('Are you sure you want to delete this friend?')) {
      try {
        await FriendStorage.deleteFriend(friendId);
        setFriends(friends.filter(f => f.id !== friendId));
      } catch (error) {
        console.error("Error deleting friend:", error);
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 bg-gray-700 rounded w-64"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-24 bg-gray-700 rounded w-full mt-4"></div>
          <div className="h-24 bg-gray-700 rounded w-full mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Friends</h1>
        <AddFriendButton />
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="space-y-4">
        {filteredFriends.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <p className="text-slate-400">No friends found. Add a friend to get started!</p>
          </div>
        ) : (
          filteredFriends.map(friend => (
            <div key={friend.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <Link href={`/friends/${friend.id}`}>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition">
                    {friend.name}
                  </h3>
                </Link>
                <button 
                  onClick={() => handleDeleteFriend(friend.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-4">
                <Link href={`/friends/${friend.id}/notes`} className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Pending Notes
                </Link>
                
                <Link href={`/friends/${friend.id}/dates`} className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upcoming Dates
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}