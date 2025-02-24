'use client';

import { useState } from 'react';

interface TopicEntryProps {
  onSave: (content: string) => void;
}

export default function TopicEntry({ onSave }: TopicEntryProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave(content);
    setContent(''); // Clear input after saving
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        placeholder="Write your topic here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 rounded h-32"
        required
      />
      <button type="submit" className="btn btn-primary">
        Save Topic
      </button>
    </form>
  );
}
