'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopicStorage } from '@/utils/topics_storage';
import { v4 as uuidv4 } from 'uuid';

export default function NewTopicPage() {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'general' | 'action'>('general');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTopic = {
      id: uuidv4(),
      friendId: 'default-friend-id', // This should be dynamically assigned
      content,
      type,
      status: type === 'action' ? ('Pending' as 'Pending' | 'Complete' | undefined) : undefined,
      createdAt: new Date().toISOString(),
    };
    await TopicStorage.addTopic(newTopic);
    router.push('/topics');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Topic</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value as 'general' | 'action')} 
          className="border p-2 rounded bg-gray-800 text-white focus:ring focus:ring-blue-400"
        >
          <option value="general" className="bg-gray-700 text-white">General Topic</option>
          <option value="action" className="bg-gray-700 text-white">Action Item</option>
        </select>
        <textarea
          placeholder="Write your topic here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded h-32 bg-gray-800 text-white focus:ring focus:ring-blue-400"
          required
        />
        <button type="submit" className="btn btn-primary">
          Save Topic
        </button>
      </form>
    </div>
  );
}
