'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { TaskStorage } from '@/utils/tasks_storage';
import { DateStorage, ImportantDate } from '@/utils/dates_storage';

const getRandomColor = () => {
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100', 'bg-pink-100', 'bg-indigo-100'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});
  const [upcomingDates, setUpcomingDates] = useState<Record<string, ImportantDate[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      try {
        setLoading(true);
        const storedFriends = await FriendStorage.getFriends() as Friend[];
        if (!Array.isArray(storedFriends)) {
          throw new Error("Expected an array of friends");
        }
        
        const updatedFriends = storedFriends.map(friend => ({
          ...friend,
          color: friend.color || getRandomColor()
        }));
        setFriends(updatedFriends);

        // Load pending tasks counts
        const pendingTasksCount: Record<string, number> = {};
        for (const friend of storedFriends) {
          const tasks = await TaskStorage.getTasksByFriend(friend.id);
          if (Array.isArray(tasks)) {
            pendingTasksCount[friend.id] = tasks.filter(task => task.status === 'Pending').length;
          }
        }
        setPendingCounts(pendingTasksCount);

        // Load upcoming dates
        const upcomingDatesByFriend: Record<string, ImportantDate[]> = {};
        for (const friend of storedFriends) {
          const dates = await DateStorage.getDatesByFriend(friend.id);
          if (Array.isArray(dates)) {
            const today = new Date();
            const upcoming = dates.filter(date => {
              const eventDate = new Date(date.date);
              return eventDate >= today;
            }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            upcomingDatesByFriend[friend.id] = upcoming;
          }
        }
        setUpcomingDates(upcomingDatesByFriend);
      } catch (error) {
        console.error("Error loading friends:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFriends();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading friends...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Friends</h1>
        <Link 
          href="/friends/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          Add Friend
        </Link>
      </div>

      {friends.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">No Friends Added Yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by adding your first friend to keep track of important details.
          </p>
          <Link 
            href="/friends/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition inline-block"
          >
            Add Your First Friend
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <Link 
              key={friend.id} 
              href={`/friends/${friend.id}`} 
              className="block transition transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`rounded-lg shadow-md overflow-hidden ${friend.color}`}>
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{friend.name}</h2>
                  {friend.contactInfo && (
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{friend.contactInfo}</p>
                  )}
                  
                  {friend.tags && friend.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {friend.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="bg-white bg-opacity-50 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4">
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">Tasks: </span>
                      <span className={pendingCounts[friend.id] > 0 ? "text-blue-600 font-semibold" : ""}>
                        {pendingCounts[friend.id] || 0} pending
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Dates: </span>
                      <span className={
                        upcomingDates[friend.id]?.length > 0 ? "text-blue-600 font-semibold" : ""
                      }>
                        {upcomingDates[friend.id]?.length || 0} upcoming
                      </span>
                    </div>
                  </div>
                  
                  {upcomingDates[friend.id]?.length > 0 && (
                    <div className="mt-3 text-sm">
                      <p className="font-medium">Next: {upcomingDates[friend.id][0].title}</p>
                      <p className="text-gray-600">
                        {new Date(upcomingDates[friend.id][0].date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}