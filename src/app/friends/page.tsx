// src/app/friends/page.tsx
 
'use client';

import { useEffect, useState } from 'react';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { TaskStorage } from '@/utils/tasks_storage';
import { DateStorage } from '@/utils/dates_storage';
import FriendCard from '@/components/FriendCard';
import FriendModal from '@/components/friends/FriendModal';

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const storedFriends = await FriendStorage.getAll();
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
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleDeleteFriend = async (id: string) => {
    if (confirm('Are you sure you want to delete this friend?')) {
      await FriendStorage.deleteFriend(id);
      setFriends(friends.filter((friend) => friend.id !== id));
    }
  };

  const handleFriendAdded = () => {
    // Refresh the friends list
    fetchFriends();
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Friends</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          Add Friend
        </button>
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
        <div className="container mx-auto p-4 text-center">Loading friends...</div>
      ) : filteredFriends.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-xl mb-4">No friends found.</p>
          {friends.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first friend to get started!</p>
          )}
          {friends.length === 0 && (
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="btn btn-primary"
            >
              Add Your First Friend
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onDelete={handleDeleteFriend}
              pendingTasksCount={friend.pendingTasksCount}
              upcomingDatesCount={friend.upcomingDatesCount}
            />
          ))}
        </div>
      )}

      <FriendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFriendAdded={handleFriendAdded}
      />
    </div>
  );
}