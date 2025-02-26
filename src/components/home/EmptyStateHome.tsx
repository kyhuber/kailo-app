'use client';

import Link from 'next/link';
import FeatureCard from './FeatureCard';

export default function EmptyStateHome() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
          Welcome to Kailo
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Your personal tool for maintaining meaningful friendships and never forgetting important details.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600 dark:text-teal-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Get Started!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Add your first friend to start keeping track of important details, conversations, and memorable moments.
          </p>
          <Link 
            href="/friends/new" 
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Your First Friend
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FeatureCard 
          title="Note Taking"
          description="Keep track of important details about your friends that you don't want to forget."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          }
        />
        <FeatureCard 
          title="Conversation Topics"
          description="Save ideas for future conversations so you always have something to talk about."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          }
        />
        <FeatureCard 
          title="Important Dates"
          description="Never miss birthdays, anniversaries, or other important events."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">How Kailo Works</h3>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>Add friends to keep track of their important information</li>
          <li>Create notes, topics, tasks, and important dates for each friend</li>
          <li>Use the global views to see all your tasks and upcoming dates</li>
          <li>Review a friend profile before meeting with them to refresh your memory</li>
        </ol>
      </div>
    </div>
  );
}