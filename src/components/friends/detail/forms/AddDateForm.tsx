// src/components/friends/detail/forms/AddDateForm.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';
import Modal from '@/components/shared/Modal';

interface AddDateFormProps {
  friendId: string;
  onDateAdded: (date: ImportantDate) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDateForm({ friendId, onDateAdded, isOpen, onClose }: AddDateFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'One-time' | 'Recurring'>('One-time');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newDate: ImportantDate = {
      id: uuidv4(),
      friendId,
      title,
      date,
      type,
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await DateStorage.addDate(newDate);
    onDateAdded(newDate);
    
    // Reset form
    setTitle('');
    setDate('');
    setType('One-time');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add an Important Date">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="date-title">
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="date-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Birthday, Anniversary, Trip"
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="date-value">
            Date <span className="text-rose-500">*</span>
          </label>
          <input
            id="date-value"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="date-type">
            Type
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                checked={type === 'One-time'}
                onChange={() => setType('One-time')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">One-time Event</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                checked={type === 'Recurring'}
                onChange={() => setType('Recurring')}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2">Annual (Recurring)</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="date-description">
            Description (Optional)
          </label>
          <textarea
            id="date-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add additional details about this date..."
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Date
          </button>
        </div>
      </form>
    </Modal>
  );
}