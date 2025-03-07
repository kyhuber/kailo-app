// src/app/topics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { TopicStorage, Topic } from '@/utils/topics_storage';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true);
        const storedTopics = await TopicStorage.getAll();
        if (!Array.isArray(storedTopics)) {
          throw new Error("Expected an array of topics");
        }
        setTopics(storedTopics);
      } catch (error) {
        console.error("Error loading topics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Topics</h1>
        <Link href="/topics/new" className="btn btn-primary">Add Topic</Link>
        
        {loading ? (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 dark:border-gray-200"></div>
            <p className="mt-2">Loading topics...</p>
          </div>
        ) : (
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
        )}
      </div>
    </ProtectedRoute>
  );
}