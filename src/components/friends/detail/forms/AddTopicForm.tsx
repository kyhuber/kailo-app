// src/components/friends/detail/forms/AddTopicForm.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Topic, TopicStorage } from '@/utils/topics_storage';

interface AddTopicFormProps {
  friendId: string;
  onTopicAdded: (topic: Topic) => void;
}

export default function AddTopicForm({ friendId, onTopicAdded }: AddTopicFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newTopic: Topic = {
      id: uuidv4(),
      friendId,
      content,
      status: "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await TopicStorage.addTopic(newTopic);
    onTopicAdded(newTopic);
    setContent('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium mb-2">Add a New Topic</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add something you want to discuss..."
          className="w-full p-2 border rounded dark:bg-gray-700 mb-2"
          rows={3}
          required
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Topic
        </button>
      </form>
    </div>
  );
}