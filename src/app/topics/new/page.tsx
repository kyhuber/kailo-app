// src/app/topics/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopicStorage } from '@/utils/topics_storage';
import { v4 as uuidv4 } from 'uuid';

export default function NewTopicPage() {
  const [content, setContent] = useState('');
  const friendId = 'default-friend-id'; // Changed from useState to a constant since setter isn't used
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTopic = {
      id: uuidv4(),
      friendId,
      content,
      status: "Active" as const, // Using the correct status value from the Topic interface
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), // Added the missing updatedAt field
    };
    await TopicStorage.addTopic(newTopic);
    router.push('/topics');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Topic</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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