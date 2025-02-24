'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { TaskStorage } from '@/utils/tasks_storage';
import { DateStorage, ImportantDate } from '@/utils/dates_storage';

// Color palette for friend cards
const friendColors = [
  'bg-teal-100 dark:bg-teal-900',
  'bg-amber-100 dark:bg-amber-900',
  'bg-violet-100 dark:bg-violet-900',
  'bg-emerald-100 dark:bg-emerald-900',
  'bg-rose-100 dark:bg-rose-900',
  'bg-blue-100 dark:bg-blue-900',
];

const getRandomColor = () => {
  return friendColors[Math.floor(Math.random() * friendColors.length)];
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

  const handleDeleteFriend = async (id: string) => {
    if (confirm('Are you sure you want to delete this friend?')) {
      await FriendStorage.deleteFriend(id);
      setFriends(friends.filter(friend => friend.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-md mx-auto">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Friends</h1>
        <Link 
          href="/friends/new" 
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-lg 
                   shadow-sm transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Friend
        </Link>
      </div>

      {friends.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md mx-auto max-w-lg">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">No Friends Added Yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
            Start by adding your first friend to keep track of important details and never miss a meaningful moment.
          </p>
          <Link 
            href="/friends/new" 
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg 
                     shadow-sm transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Your First Friend
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <Link 
              key={friend.id} 
              href={`/friends/${friend.id}`} 
              className="block transition transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-xl"
            >
              <div className={`rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700
                            ${friend.color} dark:bg-gray-800 h-full flex flex-col transition-all duration-300`}>
                <div className="p-5 flex-grow">
                  {/* Friend Avatar with Initials */}
                  <div className="flex items-center mb-3 space-x-3">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-60 dark:bg-gray-700 
                              flex items-center justify-center text-lg font-bold shadow-sm text-gray-800 dark:text-white">
                      {friend.name.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{friend.name}</h2>
                      {friend.contactInfo && (
                        <p className="text-gray-800 dark:text-gray-100 text-sm">{friend.contactInfo}</p>
                      )}
                    </div>
                  </div>
                  
                  {friend.tags && friend.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {friend.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="bg-white bg-opacity-60 dark:bg-gray-700 dark:text-gray-300 
                                 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-white dark:bg-gray-700 dark:bg-opacity-20 p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 
                                    ${pendingCounts[friend.id] > 0 ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                      <span className={pendingCounts[friend.id] > 0 ? "text-amber-800 dark:text-amber-300 font-medium" : "text-gray-600 dark:text-gray-400"}>
                        {pendingCounts[friend.id] || 0} task{pendingCounts[friend.id] !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 
                                    ${upcomingDates[friend.id]?.length > 0 ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                      <span className={upcomingDates[friend.id]?.length > 0 ? "text-teal-800 dark:text-teal-300 font-medium" : "text-gray-600 dark:text-gray-400"}>
                        {upcomingDates[friend.id]?.length || 0} date{upcomingDates[friend.id]?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  {upcomingDates[friend.id]?.length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="flex items-center text-gray-800 dark:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-teal-600 dark:text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <p className="font-medium">Next: {upcomingDates[friend.id][0].title}</p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 ml-5.5">
                        {new Date(upcomingDates[friend.id][0].date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-3 bg-white bg-opacity-60 dark:bg-gray-700 dark:bg-opacity-30 border-t border-gray-200 dark:border-gray-700 text-right">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteFriend(friend.id);
                    }}
                    className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 
                             text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}