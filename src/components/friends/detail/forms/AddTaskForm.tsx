// src/components/friends/detail/forms/AddTaskForm.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStorage } from '@/utils/tasks_storage';

interface AddTaskFormProps {
  friendId: string;
  onTaskAdded: (task: Task) => void;
}

export default function AddTaskForm({ friendId, onTaskAdded }: AddTaskFormProps) {
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
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium mb-2">Add a New Task</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a task you need to complete..."
          className="w-full p-2 border rounded dark:bg-gray-700 mb-2"
          rows={2}
          required
        />
        <div className="flex items-center mb-2">
          <label className="mr-3">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Normal' | 'High')}
            className="p-2 border rounded dark:bg-gray-700"
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}