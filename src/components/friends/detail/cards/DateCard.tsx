// src/components/friends/detail/cards/DateCard.tsx
import React from 'react';
import { ImportantDate } from '@/utils/dates_storage';

interface DateCardProps {
  date: ImportantDate;
  isPast?: boolean;
}

export default function DateCard({ date, isPast = false }: DateCardProps) {
  const daysUntil = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date.date);
    eventDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };
  
  return (
    <div className={`p-4 rounded-lg shadow ${
      isPast ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{date.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(date.date).toLocaleDateString()} 
            {date.type === 'Recurring' && ' (Recurring)'}
          </p>
          {date.description && (
            <p className="text-sm mt-1">{date.description}</p>
          )}
        </div>
        {!isPast && (
          <div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              new Date(date.date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {daysUntil()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}