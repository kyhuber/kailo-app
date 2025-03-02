// src/components/friends/detail/forms/AddTopicForm.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Topic, TopicStorage } from '@/utils/topics_storage';
import Modal from '@/components/shared/Modal';

interface AddTopicFormProps {
  friendId: string;
  onTopicAdded: (topic: Topic) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTopicForm({ friendId, onTopicAdded, isOpen, onClose }: AddTopicFormProps) {
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
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a New Conversation Topic">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="topic-content">
            Topic Description
          </label>
          <textarea
            id="topic-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add something you want to discuss with your friend..."
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Topic
          </button>
        </div>
      </form>
    </Modal>
  );
}