// src/components/home/DashboardHome.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Friend } from '@/utils/friends_storage';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';
import SummaryCard from './SummaryCard';
import ItemDetailModal from '@/components/shared/ItemDetailModal';

interface DashboardHomeProps {
  friends: Friend[];
  pendingTasks: number;
  upcomingDates: ImportantDate[];
}

export default function DashboardHome({ friends, pendingTasks, upcomingDates }: DashboardHomeProps) {
  // New state for selected date and friend lookup
  const [selectedDate, setSelectedDate] = useState<ImportantDate | null>(null);
  
  // Create a lookup map for friends
  const friendsMap: Record<string, Friend> = {};
  friends.forEach(friend => {
    friendsMap[friend.id] = friend;
  });
  
  // Handler for date updates
  const handleUpdateDate = (updatedItem: any) => {
    // We need to cast the generic item back to ImportantDate
    const updatedDate = updatedItem as ImportantDate;
    DateStorage.updateDate(updatedDate);
    // If you need to refresh the UI, add that logic here
  };
  
  // Handler for date deletion
    const handleDeleteDate = (dateId: string) => {
    DateStorage.deleteItem(dateId);
    // If you need to refresh the UI, add that logic here
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard 
          title="Friends" 
          value={friends.length.toString()} 
          link="/friends"
          linkText="View all friends"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
          color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200"
        />
        <SummaryCard 
          title="Pending Tasks" 
          value={pendingTasks.toString()} 
          link="/tasks"
          linkText="View all tasks"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          }
          color="bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
        />
        <SummaryCard 
          title="Upcoming Dates" 
          value={upcomingDates.length.toString()} 
          link="/calendar"
          linkText="View calendar"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
          color="bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Friends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Friends</h2>
            <Link href="/friends/new" className="text-teal-600 dark:text-teal-400 hover:underline text-sm font-medium">
              Add New
            </Link>
          </div>
          
          <div className="space-y-3">
            {friends
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3)
              .map(friend => (
                <Link 
                  key={friend.id} 
                  href={`/friends/${friend.id}`}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-sm font-bold mr-3 text-teal-800 dark:text-teal-100">
                    {friend.name.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2)}
                  </div>
                  <span className="font-medium">{friend.name}</span>
                </Link>
              ))
            }
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/friends" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View all friends →
            </Link>
          </div>
        </div>
        
        {/* Upcoming Dates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Dates</h2>
            <Link href="/calendar" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View calendar →
            </Link>
          </div>
          
          {upcomingDates.length > 0 ? (
            <div className="space-y-3">
              {upcomingDates.slice(0, 4).map(date => (
                <div 
                  key={date.id} 
                  className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg flex justify-between items-center cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-800/40 transition"
                  onClick={() => setSelectedDate(date)}
                >
                  <div>
                    <p className="font-medium text-teal-900 dark:text-teal-200">{date.title}</p>
                    <p className="text-sm text-teal-800 dark:text-teal-300">
                      {new Date(date.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Link 
                    href={`/friends/${date.friendId}`}
                    className="text-sm text-teal-700 dark:text-teal-300 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {friendsMap[date.friendId]?.name || 'Unknown Friend'}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">No upcoming dates in the next 30 days</p>
              <Link 
                href="/dates/new"
                className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Add important dates →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Date Detail Modal */}
      {selectedDate && (
        <ItemDetailModal
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          item={selectedDate}
          itemType="date"
          onDelete={handleDeleteDate}
          onUpdate={handleUpdateDate}
          onStatusChange={() => {}}
          friendId={selectedDate.friendId}
        />
      )}
    </div>
  );
}