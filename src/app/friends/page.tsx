// src/app/friends/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { TaskStorage } from '@/utils/tasks_storage';
import { DateStorage } from '@/utils/dates_storage';

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      try {
        setLoading(true);
        const storedFriends = await FriendStorage.getFriends();
        if (Array.isArray(storedFriends)) {
          const friendsWithCounts = await Promise.all(
            storedFriends.map(async (friend) => {
              const tasks = await TaskStorage.getTasksByFriend(friend.id);
              const pendingTasksCount = tasks.filter((task) => task.status === 'Pending').length;
              const dates = await DateStorage.getDatesByFriend(friend.id);
              const upcomingDatesCount = dates.filter((date) => new Date(date.date) >= new Date()).length;
              return { ...friend, pendingTasksCount, upcomingDatesCount };
            })
          );
          setFriends(friendsWithCounts);
        }
      } catch (error) {
        console.error("Error loading friends:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFriends();
  }, []);

  const handleDeleteFriend = async (id: string) => {
    if (confirm('Are you sure you want to delete this friend?')) {
      await FriendStorage.deleteFriend(id);
      setFriends(friends.filter((friend) => friend.id !== id));
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Friends</h1>
        <Link href="/friends/new" className="btn btn-primary">
          Add Friend
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {loading ? (
        <p>Loading friends...</p>
      ) : filteredFriends.length === 0 ? (
        <p className="text-center text-xl">No friends found.</p>
      ) : (
        <div className="space-y-4">
          {filteredFriends.map((friend) => (
            <div key={friend.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div>
                  <Link href={`/friends/${friend.id}`}>
                    <h2 className="text-xl font-semibold">{friend.name}</h2>
                  </Link>
                  {friend.tags && (
                    <div className="mt-1 flex space-x-2">
                      {friend.tags.map((tag) => (
                        <span key={tag} className="bg-gray-200 px-2 py-0.5 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteFriend(friend.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
              <div className="mt-4 flex space-x-8">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <span className="text-sm">
                    {friend.pendingTasksCount || 0} pending task
                    {friend.pendingTasksCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">
                    {friend.upcomingDatesCount || 0} upcoming date
                    {friend.upcomingDatesCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}