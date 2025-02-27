// src/app/friends/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { TaskStorage } from '@/utils/tasks_storage';
import { DateStorage } from '@/utils/dates_storage';
import ConfirmModal from '@/components/shared/ConfirmModal';
import AddFriendModal from '@/components/friends/AddFriendModal';

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFriends() {
      try {
        setLoading(true);
        const storedFriends = await FriendStorage.getFriends();
        if (Array.isArray(storedFriends)) {
          const friendsWithCounts = await Promise.all(
            storedFriends.map(async (friend) => {
              const tasks = await TaskStorage.getTasksByFriend(friend.id);
              const pendingTasksCount = Array.isArray(tasks) 
                ? tasks.filter((task) => task.status === 'Pending').length
                : 0;
              const dates = await DateStorage.getDatesByFriend(friend.id);
              const upcomingDatesCount = Array.isArray(dates) 
                ? dates.filter((date) => new Date(date.date) >= new Date()).length
                : 0;
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
    await FriendStorage.deleteFriend(id);
    setFriends(friends.filter((friend) => friend.id !== id));
    setFriendToDelete(null);
  };

  const handleAddFriend = (newFriend: Friend) => {
    setFriends(prev => [...prev, { ...newFriend, pendingTasksCount: 0, upcomingDatesCount: 0 }]);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Friends</h1>
        <button
          onClick={() => setIsAddFriendModalOpen(true)}
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
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-2">Loading friends...</p>
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery ? 'No friends match your search.' : 'No friends added yet.'}
          </p>
          <button
            onClick={() => setIsAddFriendModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Your First Friend
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.map((friend) => (
            <div key={friend.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <Link href={`/friends/${friend.id}`} className="block">
                  <h2 className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400">{friend.name}</h2>
                </Link>
                <button
                  onClick={() => setFriendToDelete(friend.id)}
                  className="text-gray-400 hover:text-rose-500"
                  aria-label="Delete friend"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {friend.tags && friend.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {friend.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className={friend.pendingTasksCount ? "font-medium text-blue-600 dark:text-blue-400" : ""}>
                    {friend.pendingTasksCount} task{friend.pendingTasksCount !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={friend.upcomingDatesCount ? "font-medium text-teal-600 dark:text-teal-400" : ""}>
                    {friend.upcomingDatesCount} date{friend.upcomingDatesCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <Link href={`/friends/${friend.id}`} className="mt-3 block text-center w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* Modals */}
      <AddFriendModal 
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onFriendAdded={handleAddFriend}
      />
      
      <ConfirmModal
        isOpen={!!friendToDelete}
        onClose={() => setFriendToDelete(null)}
        onConfirm={() => friendToDelete && handleDeleteFriend(friendToDelete)}
        title="Delete Friend"
        message="Are you sure you want to delete this friend? This will remove all associated notes, topics, tasks, and dates. This action cannot be undone."
        confirmButtonText="Delete"
        variant="danger"
      />
    </div>
  );
}