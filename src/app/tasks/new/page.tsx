'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskStorage } from '@/utils/tasks_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import Link from 'next/link';

export default function NewTaskPage() {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High'>('Normal');
  const [friendId, setFriendId] = useState<string>('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadFriends() {
      try {
        const allFriends = await FriendStorage.getAll();
        setFriends(allFriends);
        // Set default friend if any exists
        if (allFriends.length > 0) {
          setFriendId(allFriends[0].id);
        }
      } catch (error) {
        console.error('Error loading friends:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFriends();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !friendId) {
      alert('Please fill in all required fields');
      return;
    }

    const newTask = {
      id: uuidv4(),
      friendId,
      content,
      status: 'Pending' as const,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await TaskStorage.addTask(newTask);
      router.push('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add a New Task</h1>
      
      {friends.length === 0 ? (
        <div className="bg-amber-50 dark:bg-amber-900 border-l-4 border-amber-500 p-4 rounded-md mb-6">
          <p className="text-amber-800 dark:text-amber-200">
            You need to add a friend before creating tasks. 
            <Link href="/friends/new" className="underline ml-1 font-medium">Add a friend now</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label htmlFor="friend" className="block text-sm font-medium mb-1">
              Associated Friend <span className="text-rose-500">*</span>
            </label>
            <select 
              id="friend"
              value={friendId} 
              onChange={(e) => setFriendId(e.target.value)} 
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select a friend</option>
              {friends.map(friend => (
                <option key={friend.id} value={friend.id}>
                  {friend.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="task" className="block text-sm font-medium mb-1">
              Task Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="task"
              placeholder="What do you need to do?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select 
              id="priority"
              value={priority} 
              onChange={(e) => setPriority(e.target.value as 'Normal' | 'High')} 
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Add Task
            </button>
          </div>
        </form>
      )}
    </div>
  );
}