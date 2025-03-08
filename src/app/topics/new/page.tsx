// src/app/topics/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopicStorage } from '@/utils/topics_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';

export default function NewTopicPage() {
  const [content, setContent] = useState('');
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

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      alert('You must be logged in to add a topic');
      return;
    }

    const newTopic = {
      id: uuidv4(),
      friendId,
      content,
      status: "Active" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.uid
    };

    try {
      await TopicStorage.addItem(newTopic);
      router.push('/topics');
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('Failed to save topic. Please try again.');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add a New Topic</h1>
      
      {friends.length === 0 ? (
        <div className="bg-amber-50 dark:bg-amber-900 border-l-4 border-amber-500 p-4 rounded-md mb-6">
          <p className="text-amber-800 dark:text-amber-200">
            You need to add a friend before creating topics. 
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
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Topic Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="content"
              placeholder="Write your topic here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Save Topic
            </button>
          </div>
        </form>
      )}
    </div>
  );
}