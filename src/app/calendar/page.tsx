// src/app/calendar/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DateStorage, ImportantDate } from '@/utils/dates_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import DateModal from '@/components/dates/DateModal';
import { AiOutlineCalendar, AiOutlinePlus } from 'react-icons/ai';
import ProtectedRoute from '@/components/ProtectedRoute';
import ItemDetailModal from '@/components/shared/ItemDetailModal';
import { ItemStatus } from '@/types/shared';

export default function CalendarPage() {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [friends, setFriends] = useState<Record<string, Friend>>({});
  const [loading, setLoading] = useState(true);
  const [isAddDateModalOpen, setIsAddDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<ImportantDate | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Load all dates
        const allDates = await DateStorage.getAll() as ImportantDate[];
        if (Array.isArray(allDates)) {
          setDates(allDates);
        }
        
        // Load all friends for reference
        const allFriends = await FriendStorage.getAll() as Friend[];
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

  const handleAddDate = (newDate: ImportantDate) => {
    setDates(prev => [...prev, newDate]);
  };

  const handleUpdateDate = (updatedDate: any) => {
    setDates(prev => prev.map(date => date.id === updatedDate.id ? updatedDate : date));
    setSelectedDate(null); // Close modal after update
  };

  const handleDeleteDate = async (dateId: string) => {
    await DateStorage.deleteItem(dateId);
    setDates(prev => prev.filter(date => date.id !== dateId));
    setSelectedDate(null);
  };

  const handleStatusChange = async (dateId: string, status: string) => {
    const dateToUpdate = dates.find(d => d.id === dateId);
    if (dateToUpdate) {
      const updatedDate = {
        ...dateToUpdate,
        status: status as ItemStatus,
        updatedAt: new Date().toISOString()
      };
      await DateStorage.updateDate(updatedDate);
      setDates(dates.map(date => date.id === dateId ? updatedDate : date));
      setSelectedDate(null); // Close the modal after status change
    }
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

  const groupedDates = groupDatesByMonth();
  
  // Count months with events
  const monthsWithEvents = Object.entries(groupedDates).filter(([, monthDates]) => 
    monthDates.length > 0
  );
  
  const hasAnyEvents = monthsWithEvents.length > 0;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 text-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calendar</h1>
          <button 
            onClick={() => setIsAddDateModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
          >
            <AiOutlinePlus className="h-5 w-5" />
            Add Date
          </button>
        </div>
        
        {!hasAnyEvents ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300">
                <AiOutlineCalendar className="h-12 w-12" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No important dates yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Add birthdays, anniversaries, or any important events to keep track of memorable dates with your friends.
            </p>
            <button
              onClick={() => setIsAddDateModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
            >
              <AiOutlinePlus className="h-5 w-5" />
              Add Your First Date
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Show all populated months first */}
            {monthsWithEvents.map(([month, monthDates]) => (
              <div key={month} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 text-white p-3">
                  <h2 className="text-xl font-semibold">{month}</h2>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {monthDates.map(date => (
                    <div 
                      key={date.id} 
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{date.title}</h3>
                            {date.type === 'Recurring' && (
                              <span className="ml-2 bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100 text-xs font-semibold px-2 py-1 rounded">
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
                            className="text-sm text-teal-600 dark:text-teal-400 hover:underline block mt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {friends[date.friendId]?.name || 'Unknown Friend'}
                          </Link>
                          
                          {date.description && (
                            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{date.description}</p>
                          )}
                        </div>
                        
                        <div>
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            new Date(date.date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
                              : 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200'
                          }`}>
                            {getDaysUntil(date.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Empty months in collapsed view */}
            {Object.entries(groupedDates)
              .filter(([, monthDates]) => monthDates.length === 0)
              .length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
                  <details className="group">
                    <summary className="list-none flex justify-between items-center cursor-pointer p-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                      <span>Months with no events</span>
                      <span className="transform group-open:rotate-180 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </summary>
                    <div className="pt-1 pb-2 px-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(groupedDates)
                          .filter(([, monthDates]) => monthDates.length === 0)
                          .map(([month]) => (
                            <div key={month} className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              {month}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </details>
                </div>
              )}
          </div>
        )}

        {/* Add Date Modal */}
        <DateModal
          isOpen={isAddDateModalOpen}
          onClose={() => setIsAddDateModalOpen(false)}
          onDateAdded={handleAddDate}
          friends={Object.values(friends)}
        />

        {/* Date Detail Modal */}
        {selectedDate && (
          <ItemDetailModal
            isOpen={!!selectedDate}
            onClose={() => setSelectedDate(null)}
            item={selectedDate}
            itemType="date"
            onDelete={handleDeleteDate}
            onUpdate={handleUpdateDate}
            onStatusChange={handleStatusChange}
            friendId={selectedDate.friendId}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}