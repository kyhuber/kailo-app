// src/app/calendar/page.tsx - Updated with DateModal
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DateStorage, ImportantDate } from '@/utils/dates_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import DateModal from '@/components/dates/DateModal';

export default function CalendarPage() {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [friends, setFriends] = useState<Record<string, Friend>>({});
  const [loading, setLoading] = useState(true);
  // Add state for the DateModal
  const [isAddDateModalOpen, setIsAddDateModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Load all dates
        const allDates = await DateStorage.getAllDates() as ImportantDate[];
        if (Array.isArray(allDates)) {
          setDates(allDates);
        }
        
        // Load all friends for reference
        const allFriends = await FriendStorage.getFriends() as Friend[];
        if (Array.isArray(allFriends)) {
          const friendsMap: Record<string, Friend> = {};
          allFriends.forEach(friend => {
            friendsMap[friend.id] = friend;
          });
          setFriends(friendsMap);
        }
      } catch (error) {
        console.error("Error loading dates:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Add handler for adding a new date
  const handleAddDate = (newDate: ImportantDate) => {
    setDates(prev => [...prev, newDate]);
  };

  const groupDatesByMonth = () => {
    const grouped: Record<string, ImportantDate[]> = {};
    
    // Get current month and next 11 months
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthKey = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      grouped[monthKey] = [];
    }
    
    // Add dates to appropriate months
    dates.forEach(date => {
      const dateObj = new Date(date.date);
      const monthKey = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      // Only include dates from the current month onwards
      if (dateObj >= new Date(today.getFullYear(), today.getMonth(), 1)) {
        if (!grouped[monthKey]) {
          grouped[monthKey] = [];
        }
        grouped[monthKey].push(date);
      }
    });
    
    // Sort dates within each month
    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
    
    return grouped;
  };

  const groupedDates = groupDatesByMonth();

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading calendar...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <button 
          onClick={() => setIsAddDateModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Date
        </button>
      </div>
      
      {dates.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No important dates have been added yet.
          </p>
          <button
            onClick={() => setIsAddDateModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Add a Date
          </button>
          <Link 
            href="/friends" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Go to Friends
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedDates).map(([month, monthDates]) => (
            <div key={month} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-500 text-white p-3">
                <h2 className="text-xl font-semibold">{month}</h2>
              </div>
              
              {monthDates.length === 0 ? (
                <div className="p-4 text-gray-600 dark:text-gray-400">
                  No events in this month
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {monthDates.map(date => (
                    <div key={date.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{date.title}</h3>
                            {date.type === 'Recurring' && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                Annual
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(date.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          
                          <Link 
                            href={`/friends/${date.friendId}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline block mt-1"
                          >
                            {friends[date.friendId]?.name || 'Unknown Friend'}
                          </Link>
                          
                          {date.description && (
                            <p className="text-sm mt-2">{date.description}</p>
                          )}
                        </div>
                        
                        <div>
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            new Date(date.date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {getDaysUntil(date.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add DateModal component */}
      <DateModal
        isOpen={isAddDateModalOpen}
        onClose={() => setIsAddDateModalOpen(false)}
        onDateAdded={handleAddDate}
        friends={Object.values(friends)}
      />
    </div>
  );
}