'use client';

import { useEffect, useState } from 'react';
import { DateStorage, ImportantDate } from '@/utils/dates_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DatesPage() {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [friends, setFriends] = useState<Record<string, Friend>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDates() {
      try {
        setLoading(true);
        // Get all dates
        const storedDates = await DateStorage.getAll();
        if (Array.isArray(storedDates)) {
          setDates(storedDates);
        }

        // Get all friends for reference
        const allFriends = await FriendStorage.getAll();
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
    fetchDates();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">All Important Dates</h1>
          <Link href="/dates/new" className="btn btn-primary">Add Date</Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-gray-100"></div>
            <p className="mt-4">Loading dates...</p>
          </div>
        ) : dates.length > 0 ? (
          <div className="grid gap-4">
            {dates.map((entry) => (
              <div key={entry.id} className="card flex justify-between items-center p-4">
                <div>
                  <h3 className="font-medium">{entry.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  <Link 
                    href={`/friends/${entry.friendId}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {friends[entry.friendId]?.name || 'Unknown Friend'}
                  </Link>
                </div>
                <div>
                  <Link 
                    href={`/calendar`}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    View in calendar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-xl mb-4">No dates recorded yet.</p>
            <Link href="/dates/new" className="btn btn-primary">
              Add Your First Date
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}