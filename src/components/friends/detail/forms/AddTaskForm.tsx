// src/components/friends/detail/forms/AddTaskForm.tsx
'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TaskStorage, Task } from '@/utils/tasks_storage';
import { Friend } from '@/utils/friends_storage';
import Modal from '@/components/shared/Modal';

interface AddTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
  friendId?: string;
  initialData?: Partial<Task>;
  friends?: Friend[];
}

export default function AddTaskForm({ isOpen, onClose, onTaskAdded, friendId, initialData, friends }: AddTaskFormProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [priority, setPriority] = useState<'Normal' | 'High'>(initialData?.priority || 'Normal');
  const [selectedFriendId, setSelectedFriendId] = useState<string>(friendId || '');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!content.trim() || (!friendId && !selectedFriendId)) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newTask: Task = {
      id: initialData?.id || uuidv4(),
      friendId: friendId || selectedFriendId, // Use selected friendId if it exists, otherwise fallback to friendId
      content,
      status: 'Pending',
      priority,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (initialData?.id) {
        await TaskStorage.updateTaskStatus(initialData.id, initialData.status as 'Active' | 'Archived' | 'Complete' | 'Pending');
        onTaskAdded(newTask);
    } else {
        TaskStorage.addTask(newTask);
        onTaskAdded(newTask);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData?.id ? "Update Task" : "Add Task"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!friendId && (
            <div className="flex flex-col gap-1">
              <label htmlFor="friend" className="font-medium">
                Associated Friend <span className="text-rose-500">*</span>
              </label>
                <select
                    id="friend"
                    value={selectedFriendId}
                    onChange={(e) => setSelectedFriendId(e.target.value)}
                    className="border p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                    required
                >
                    <option value="" disabled>Select a friend</option>
                    {friends?.map(friend => (
                        <option key={friend.id} value={friend.id}>{friend.name}</option>
                    ))}
                </select>
            </div>
        )}
        
        <div className="flex flex-col gap-1">
          <label htmlFor="content" className="font-medium">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="border p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="priority" className="font-medium">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Normal' | 'High')}
            className="border p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
        >
          {initialData?.id ? "Update Task" : "Add Task"}
        </button>
      </form>
    </Modal>
  );
}
