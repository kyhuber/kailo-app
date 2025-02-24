'use client';

import { useEffect, useState } from 'react';
import { TopicStorage } from '@/utils/topics_storage';
import Link from 'next/link';

interface Topic {
  id: string;
  content: string;
  type: "general" | "action";
  status?: "Pending" | "Complete";
  createdAt: string;
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    async function fetchTopics() {
      const storedTopics = await TopicStorage.getTopicsByFriend("all"); // Fetch all topics
      if (!Array.isArray(storedTopics)) {
        throw new Error("Expected an array of topics");
      }
      setTopics(storedTopics as Topic[]);
    }
    fetchTopics();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Topics</h1>
      <Link href="/topics/new" className="btn btn-primary">Add Topic</Link>
      <div className="mt-4 space-y-4">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div key={topic.id} className="card">
              <p className="text-gray-800 dark:text-gray-200">{topic.content}</p>
              <small className="text-gray-500 dark:text-gray-400">{new Date(topic.createdAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No topics recorded yet.</p>
        )}
      </div>
    </div>
  );
}
