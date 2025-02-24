'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FriendStorage } from '@/utils/friends_storage';
import { v4 as uuidv4 } from 'uuid';

export default function AddFriendPage() {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newFriend = {
      id: uuidv4(),
      name,
      contactInfo: contactInfo || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
    };
    await FriendStorage.addFriend(newFriend);
    router.push('/friends');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Friend</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Contact Info (optional)"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated, optional)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="btn btn-primary">
          Save Friend
        </button>
      </form>
    </div>
  );
}
