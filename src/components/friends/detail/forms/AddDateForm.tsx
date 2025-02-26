// src/components/friends/detail/forms/AddDateForm.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';

interface AddDateFormProps {
  friendId: string;
  onDateAdded: (date: ImportantDate) => void;
}

export default function AddDateForm({ friendId, onDateAdded }: AddDateFormProps) {
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
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium mb-2">Add a New Date</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Birthday, Anniversary"
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'One-time' | 'Recurring')}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="One-time">One-time Event</option>
            <option value="Recurring">Recurring (Annual)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add additional details..."
            className="w-full p-2 border rounded dark:bg-gray-700"
            rows={2}
          />
        </div>
        
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Date
        </button>
      </form>
    </div>
  );
}