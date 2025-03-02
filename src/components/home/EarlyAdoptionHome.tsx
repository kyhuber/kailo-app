'use client';

import Link from 'next/link';
import { Friend } from '@/utils/friends_storage';
import { ImportantDate } from '@/utils/dates_storage';
import QuickActionCard from './QuickActionCard';

interface EarlyAdoptionHomeProps {
  friends: Friend[];
  pendingTasks: number;
  upcomingDates: ImportantDate[];
}

export default function EarlyAdoptionHome({ friends, pendingTasks, upcomingDates }: EarlyAdoptionHomeProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
          Welcome to Kailo
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Your personal friendship management tool
        </p>
      </div>
      
      {/* Friend showcase */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Friends</h2>
          <Link href="/friends/new" className="text-teal-600 dark:text-teal-400 hover:underline text-sm font-medium inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Friend
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friends.map(friend => (
            <Link 
              key={friend.id} 
              href={`/friends/${friend.id}`}
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-lg font-bold mr-4 text-teal-800 dark:text-teal-100">
                {friend.name.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2)}
              </div>
              <div>
                <h3 className="font-medium">{friend.name}</h3>
                {friend.contactInfo && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{friend.contactInfo}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/friends" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
            View all friends →
          </Link>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <QuickActionCard 
              title="Add a Task"
              description="Add a new task to complete"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600 dark:text-teal-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              }
              href="/tasks/new"
              bgColor="bg-teal-50 dark:bg-teal-900/30"
            />
            <QuickActionCard 
              title="Add Important Date"
              description="Save birthdays and events"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              }
              href="/dates/new"
              bgColor="bg-blue-50 dark:bg-blue-900/30"
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 text-teal-800 dark:text-teal-200">
                1
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Add more details to your friend profiles, like conversation topics or important dates
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 text-teal-800 dark:text-teal-200">
                2
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Check the calendar view to see upcoming birthdays and events
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 text-teal-800 dark:text-teal-200">
                3
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Use the friend detail page to review information before meeting with a friend
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tasks</h2>
            <Link href="/tasks" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View all →
            </Link>
          </div>
          
          {pendingTasks > 0 ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                You have {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''}
              </p>
              <Link 
                href="/tasks"
                className="mt-2 inline-block text-sm text-amber-700 dark:text-amber-300 font-medium hover:underline"
              >
                View your tasks →
              </Link>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">No pending tasks</p>
              <Link 
                href="/tasks/new"
                className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Add a task →
              </Link>
            </div>
          )}
        </div>
        
        {/* Dates overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Dates</h2>
            <Link href="/calendar" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View calendar →
            </Link>
          </div>
          
          {upcomingDates.length > 0 ? (
            <div className="space-y-3">
              {upcomingDates.slice(0, 2).map(date => (
                <div key={date.id} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                  <p className="font-medium text-teal-900 dark:text-teal-200">{date.title}</p>
                  <p className="text-sm text-teal-800 dark:text-teal-300">
                    {new Date(date.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {upcomingDates.length > 2 && (
                <Link 
                  href="/calendar"
                  className="inline-block text-sm text-teal-700 dark:text-teal-300 font-medium hover:underline"
                >
                  +{upcomingDates.length - 2} more dates →
                </Link>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">No upcoming dates</p>
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
    </div>
  );
}