// src/components/tasks/TaskModal.tsx
'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TaskStorage, Task } from '@/utils/tasks_storage';
import { Friend } from '@/utils/friends_storage';
import Modal from '@/components/shared/Modal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
  friends: Friend[];
  initialData?: Partial<Task>;
}

export default function TaskModal({ isOpen, onClose, onTaskAdded, friends, initialData }: TaskModalProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [friendId, setFriendId] = useState(initialData?.friendId || (friends.length > 0 ? friends[0].id : ''));
  const [priority, setPriority] = useState<'Normal' | 'High'>(initialData?.priority || 'Normal');

  const resetForm = () => {
    setContent('');
    setFriendId(friends.length > 0 ? friends[0].id : '');
    setPriority('Normal');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !friendId) {
      return;
    }
    
    const newTask: Task = {
      id: initialData?.id || uuidv4(),
      friendId,
      content: content.trim(),
      status: initialData?.status || 'Pending',
      priority,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: initialData?.completedAt
    };
    
    await TaskStorage.addTask(newTask);
    onTaskAdded(newTask);
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Task" : "Add a New Task"}>
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
              You need to add a friend before creating tasks.
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="task-content">
            Task Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="task-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you need to do?"
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Priority
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="priority"
                checked={priority === 'Normal'}
                onChange={() => setPriority('Normal')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Normal</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="priority"
                checked={priority === 'High'}
                onChange={() => setPriority('High')}
                className="h-4 w-4 text-rose-600 focus:ring-rose-500"
              />
              <span className="ml-2 text-rose-600 font-medium">High Priority</span>
            </label>
          </div>
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
            {initialData ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}