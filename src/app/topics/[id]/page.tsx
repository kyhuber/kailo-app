// src/app/topics/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Topic, TopicStorage } from '@/utils/topics_storage';

// Remove the local Topic interface definition since we're importing it

export default function TopicDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const topicId = Array.isArray(id) ? id[0] : id || '';
  const [topic, setTopic] = useState<Topic | null>(null);

  useEffect(() => {
    async function fetchTopic() {
      const topics = await TopicStorage.getTopicsByFriend(topicId);
      if (!Array.isArray(topics)) {
        throw new Error("Expected an array of topics");
      }
      const foundTopic = topics.find(t => t.id === topicId);
      if (foundTopic) {
        setTopic(foundTopic);
      } else {
        router.push('/topics'); // Redirect if not found
      }
    }
    if (topicId) fetchTopic();
  }, [topicId, router]);

  if (!topic) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Topic Details</h1>
      <p className="text-gray-800 dark:text-gray-200 text-lg">{topic.content}</p>
      <small className="text-gray-500 dark:text-gray-400">{new Date(topic.createdAt).toLocaleString()}</small>
      <button
        onClick={() => router.push('/topics')}
        className="btn btn-primary mt-4"
      >
        Back to Topics
      </button>
    </div>
  );
}