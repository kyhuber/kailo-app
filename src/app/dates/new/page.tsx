'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DateStorage } from '@/utils/dates_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

export default function NewDatePage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'One-time' | 'Recurring'>('One-time');
  const [description, setDescription] = useState('');
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
    
    if (!title.trim() || !date || !friendId) {
      alert('Please fill in all required fields');
      return;
    }

    const newDate = {
      id: uuidv4(),
      friendId,
      title,
      date,
      type,
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await DateStorage.addDate(newDate);
      router.push('/calendar');
    } catch (error) {
      console.error('Error saving date:', error);
      alert('Failed to save date. Please try again.');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add an Important Date</h1>
      
      {friends.length === 0 ? (
        <div className="bg-amber-50 dark:bg-amber-900 border-l-4 border-amber-500 p-4 rounded-md mb-6">
          <p className="text-amber-800 dark:text-amber-200">
            You need to add a friend before creating important dates. 
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
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Birthday, Anniversary, Trip"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Type
            </label>
            <select 
              id="type"
              value={type} 
              onChange={(e) => setType(e.target.value as 'One-time' | 'Recurring')} 
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="One-time">One-time Event</option>
              <option value="Recurring">Recurring (Annual)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Add any additional details about this date"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Save Date
            </button>
          </div>
        </form>
      )}
    </div>
  );
}