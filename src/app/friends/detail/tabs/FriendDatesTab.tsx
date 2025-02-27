// src/components/friends/detail/tabs/FriendDatesTab.tsx
import React, { useState } from 'react';
import { ImportantDate } from '@/utils/dates_storage';
import DateCard from '../cards/DateCard';
import AddDateForm from '../forms/AddDateForm';

interface FriendDatesTabProps {
  friendId: string;
  dates: ImportantDate[];
  setDates: React.Dispatch<React.SetStateAction<ImportantDate[]>>;
}

export default function FriendDatesTab({ friendId, dates, setDates }: FriendDatesTabProps) {
  const [isAddDateModalOpen, setIsAddDateModalOpen] = useState(false);
  
  const upcomingDates = dates.filter(date => new Date(date.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const pastDates = dates.filter(date => new Date(date.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddDate = (newDate: ImportantDate) => {
    setDates(prev => [...prev, newDate]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Important Dates</h2>
        <button 
          onClick={() => setIsAddDateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Add Date
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Track birthdays, events, and other significant dates related to your friend.
      </p>
      
      {/* Upcoming Dates */}
      <h3 className="font-medium text-lg mb-3">Upcoming Dates</h3>
      {upcomingDates.length > 0 ? (
        <div className="space-y-3 mb-6">
          {upcomingDates.map(date => (
            <DateCard key={date.id} date={date} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          No upcoming dates. Add important dates like birthdays or events.
        </p>
      )}

      {/* Past Dates */}
      {pastDates.length > 0 && (
        <>
          <h3 className="font-medium text-lg mb-3">Past Dates</h3>
          <div className="space-y-3">
            {pastDates.map(date => (
              <DateCard key={date.id} date={date} isPast={true} />
            ))}
          </div>
        </>
      )}
      
      {/* Modal */}
      <AddDateForm 
        friendId={friendId} 
        onDateAdded={handleAddDate} 
        isOpen={isAddDateModalOpen}
        onClose={() => setIsAddDateModalOpen(false)}
      />
    </div>
  );
}