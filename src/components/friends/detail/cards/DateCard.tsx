// src/components/friends/detail/cards/DateCard.tsx
import React, { useState } from 'react';
import { ImportantDate } from '@/utils/dates_storage';
import { AiOutlineCalendar } from 'react-icons/ai';
import AddDateForm from '@/components/friends/detail/forms/AddDateForm';

interface DateCardProps {
  item: ImportantDate;
  onDateUpdated: (date: ImportantDate) => void;
  onClick?: (date: ImportantDate) => void;
}

export default function DateCard({ item, onDateUpdated, onClick }: DateCardProps) {
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDateModalOpen(true);
  };

  return (
    <div 
      className="p-4 rounded-lg shadow flex justify-between items-center bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
      onClick={handleClick}
    >
      <div className='flex items-center gap-2'>
        <AiOutlineCalendar size={24} />
        <div className='my-1'>
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {new Date(item.date).toLocaleDateString()}
            {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString()}`}
            {item.type === 'Recurring' && ' (Recurring)'}
          </p>
          {item.description && (
            <p className="text-sm mt-1">{item.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={handleButtonClick}
          className="text-blue-500 hover:text-blue-700"
        >
          Edit
        </button>
        <AddDateForm
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
          initialData={item}
          onDateAdded={onDateUpdated}
        />
      </div>
    </div>
  );
}