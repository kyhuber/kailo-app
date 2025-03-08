// src/app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { TaskStorage } from '@/utils/tasks_storage';
import { DateStorage, ImportantDate } from '@/utils/dates_storage';
import EmptyStateHome from '@/components/home/EmptyStateHome';
import DashboardHome from '@/components/home/DashboardHome';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function HomePage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [upcomingDates, setUpcomingDates] = useState<ImportantDate[]>([]);
  const [pendingTasks, setPendingTasks] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch friends data
        const storedFriends = await FriendStorage.getAll();
        setFriends(Array.isArray(storedFriends) ? storedFriends : []);

        // Get pending tasks count
        const allTasks = await TaskStorage.getTasksByFriend('all');
        const pendingCount = Array.isArray(allTasks) 
          ? allTasks.filter(task => task.status === 'Pending').length 
          : 0;
        setPendingTasks(pendingCount);

        // Get upcoming dates (next 30 days)
        const allDates = await DateStorage.getAll();
        if (Array.isArray(allDates)) {
          const today = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          
          const upcoming = allDates.filter(date => {
            const eventDate = new Date(date.date);
            return eventDate >= today && eventDate <= thirtyDaysFromNow;
          }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          setUpcomingDates(upcoming);
        }
      } catch (error) {
        console.error("Error loading homepage data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="container mx-auto p-6 text-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      ) : friends.length === 0 ? (
        <EmptyStateHome />
      ) : (
        <DashboardHome 
          friends={friends} 
          pendingTasks={pendingTasks} 
          upcomingDates={upcomingDates} 
        />
      )}
    </ProtectedRoute>
  );
}