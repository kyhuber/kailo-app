// src/components/friends/detail/forms/AddTaskForm.tsx
import React, { useState, useEffect } from 'react';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import Modal from '@/components/shared/Modal';
import { Friend } from '@/utils/friends_storage'; // Import Friend type
import Select from 'react-select'; // Import react-select

interface AddTaskFormProps {
  friendId?: string; // Make friendId optional
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
  friends?: Friend[]; // Add the friends prop
}

export default function AddTaskForm({ friendId, isOpen, onClose, onTaskAdded, friends }: AddTaskFormProps) {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High'>('Normal'); // Updated priority options
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<{ value: string; label: string } | null>(null); // Initialize the new state variable

  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setPriority('Normal'); // Set to 'Normal' on close
      setSelectedFriend(null); // Clear the selected friend when the modal closes
    } else if (friendId && friends) {
      const initialFriend = friends.find((friend) => friend.id === friendId);
      if (initialFriend) {
        setSelectedFriend({ value: initialFriend.id, label: initialFriend.name });
      }
    }
  }, [isOpen, friendId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || content.trim() === '') return;
    setIsSubmitting(true);

    try {
      let actualFriendId = selectedFriend ? selectedFriend.value : null;
      // If friendId was passed down, use it as a fallback
      if (!actualFriendId && friendId) {
        actualFriendId = friendId;
      }
      if (!actualFriendId) {
        throw new Error("Must select a friend when adding a task");
      }

      const newTask: Task = {
        id: crypto.randomUUID(),
        friendId: actualFriendId, // Use the selected friend's ID
        content,
        status: 'Pending',
        priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await TaskStorage.addTask(newTask);
      onTaskAdded(newTask);
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const friendOptions = friends?.map((friend) => ({
    value: friend.id,
    label: friend.name,
  })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Task">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Friend Select */}
        {!friendId && (
          <div>
            <label htmlFor="friend" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Friend
            </label>
            <Select
              className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              options={friendOptions}
              value={selectedFriend}
              onChange={(selectedOption) =>
                setSelectedFriend(selectedOption as { value: string; label: string })
              }
            />
          </div>
        )}

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Task Description
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter task description..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Normal' | 'High')} // Updated priority type
          >
            <option value="Normal">Normal</option> {/* Updated value */}
            <option value="High">High</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || content.trim() === ''}
            className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 ${isSubmitting || content.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
