// src/components/friends/forms/AddDateForm.tsx
'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';
import Modal from '@/components/shared/Modal';

interface AddDateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onDateAdded: (date: ImportantDate) => void;
  friendId?: string;
  initialData?: Partial<ImportantDate>;
}

export default function AddDateForm({ isOpen, onClose, onDateAdded, friendId, initialData }: AddDateFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [type, setType] = useState<'One-time' | 'Recurring'>(initialData?.type || 'One-time');
  const [description, setDescription] = useState(initialData?.description || '');

  const resetForm = () => {
    setTitle('');
    setDate('');
    setEndDate('');
    setType('One-time');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date) {
      return;
    }

    const newDate: ImportantDate = {
      id: initialData?.id || uuidv4(),
      friendId: friendId || '',
      title: title.trim(),
      date,
      endDate: endDate || undefined,
      type,
      description: description.trim() || undefined,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: initialData?.status || 'Active', // Added the status
    };
    if (initialData?.id) {
      await DateStorage.updateDate(newDate);
      onDateAdded(newDate);
    } else {
      await DateStorage.addDate(newDate);
      onDateAdded(newDate);
    }
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Date" : "Add an Important Date"}>
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
          <label className="block text-sm font-medium mb-1" htmlFor="end-date-value">
            End Date (Optional)
          </label>
          <input
            id="end-date-value"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            min={date}
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
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {initialData ? "Save Changes" : "Add Date"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
