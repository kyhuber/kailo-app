// src/components/dates/DateModal.tsx
'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';
import { Friend } from '@/utils/friends_storage';
import Modal from '@/components/shared/Modal';

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateAdded: (date: ImportantDate) => void;
  friends: Friend[];
  initialData?: Partial<ImportantDate>;
}

export default function DateModal({ isOpen, onClose, onDateAdded, friends, initialData }: DateModalProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [friendId, setFriendId] = useState(initialData?.friendId || (friends.length > 0 ? friends[0].id : ''));
  const [type, setType] = useState<'One-time' | 'Recurring'>(initialData?.type || 'One-time');
  const [description, setDescription] = useState(initialData?.description || '');

  const resetForm = () => {
    setTitle('');
    setDate('');
    setFriendId(friends.length > 0 ? friends[0].id : '');
    setType('One-time');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !date || !friendId) {
      return;
    }
    
    const newDate: ImportantDate = {
      id: initialData?.id || uuidv4(),
      friendId,
      title: title.trim(),
      date,
      type,
      description: description.trim() || undefined,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await DateStorage.addDate(newDate);
    onDateAdded(newDate);
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Date" : "Add an Important Date"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="friend-select">
            Associated Friend <span className="text-rose-500">*</span>
          </label>
          {friends.length > 0 ? (
            <select
              id="friend-select"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select a friend</option>
              {friends.map(friend => (
                <option key={friend.id} value={friend.id}>
                  {friend.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-3 text-amber-800 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-200 rounded-md">
              You need to add a friend before creating dates.
            </div>
          )}
        </div>
        
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
          <select
            id="date-type"
            value={type}
            onChange={(e) => setType(e.target.value as 'One-time' | 'Recurring')}
            className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="One-time">One-time Event</option>
            <option value="Recurring">Recurring (Annual)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="date-description">
            Description (Optional)
          </label>
          <textarea
            id="date-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add additional details..."
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={friends.length === 0}
            className={`px-4 py-2 text-white rounded-md ${
              friends.length > 0 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {initialData ? "Save Changes" : "Add Date"}
          </button>
        </div>
      </form>
    </Modal>
  );
}