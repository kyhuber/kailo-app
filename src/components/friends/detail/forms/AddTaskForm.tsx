// src/components/friends/detail/forms/AddTaskForm.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import Modal from '@/components/shared/Modal';

interface AddTaskFormProps {
  friendId: string;
  onTaskAdded: (task: Task) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaskForm({ friendId, onTaskAdded, isOpen, onClose }: AddTaskFormProps) {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High'>('Normal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      friendId,
      content,
      status: "Pending",
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await TaskStorage.addTask(newTask);
    onTaskAdded(newTask);
    setContent('');
    setPriority('Normal');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="task-content">
            Task Description
          </label>
          <textarea
            id="task-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a task you need to complete..."
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="task-priority">
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
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </form>
    </Modal>
  );
}