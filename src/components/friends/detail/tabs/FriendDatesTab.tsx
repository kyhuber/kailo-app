// src/components/friends/detail/tabs/FriendDatesTab.tsx
import React from 'react';
import { ImportantDate } from '@/utils/dates_storage';
import DateCard from '../cards/DateCard';
import AddDateForm from '../forms/AddDateForm';

interface FriendDatesTabProps {
  friendId: string;
  dates: ImportantDate[];
  setDates: React.Dispatch<React.SetStateAction<ImportantDate[]>>;
}

export default function FriendDatesTab({ friendId, dates, setDates }: FriendDatesTabProps) {
  const upcomingDates = dates.filter(date => new Date(date.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const pastDates = dates.filter(date => new Date(date.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddDate = (newDate: ImportantDate) => {
    setDates(prev => [...prev, newDate]);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Important Dates</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Track birthdays, events, and other significant dates related to your friend.
      </p>
      
      {/* Add Date Form */}
      <AddDateForm friendId={friendId} onDateAdded={handleAddDate} />

      {/* Upcoming Dates */}
      <h3 className="font-medium text-lg mb-2">Upcoming Dates</h3>
      {upcomingDates.length > 0 ? (
        <div className="space-y-3 mb-6">
          {upcomingDates.map(date => (
            <DateCard key={date.id} date={date} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">No upcoming dates.</p>
      )}

      {/* Past Dates */}
      <h3 className="font-medium text-lg mb-2">Past Dates</h3>
      {pastDates.length > 0 ? (
        <div className="space-y-3">
          {pastDates.map(date => (
            <DateCard key={date.id} date={date} isPast={true} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No past dates.</p>
      )}
    </div>
  );
}