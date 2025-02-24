'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FriendStorage } from '@/utils/friends_storage';
import { TopicStorage } from '@/utils/topics_storage';
import { DateStorage } from '@/utils/dates_storage';
import { v4 as uuidv4 } from 'uuid';

interface Friend {
  id: string;
  name: string;
  contactInfo?: string;
  tags?: string[];
  color?: string;
}

interface Topic {
  id: string;
  friendId: string;
  content: string;
  type: "general" | "action";
  status?: "Pending" | "Complete";
  createdAt: string;
}

interface DateEntry {
  id: string;
  friendId: string;
  title: string;
  date: string;
}

const getRandomColor = () => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function FriendDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const friendId = Array.isArray(id) ? id[0] : id || '';
  const [friend, setFriend] = useState<Friend | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [dates, setDates] = useState<DateEntry[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [topicType, setTopicType] = useState<"general" | "action">("general");
  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    async function fetchFriendData() {
      const friends = await FriendStorage.getFriends();
      if (!Array.isArray(friends)) {
        throw new Error("Expected an array of friends");
      }
      const foundFriend = friends.find(f => f.id === friendId);
      if (foundFriend) {
        if (!foundFriend.color) {
          foundFriend.color = getRandomColor();
        }
        setFriend(foundFriend);
      } else {
        router.push('/friends');
      }

      const friendTopics = await TopicStorage.getTopicsByFriend(friendId);
      if (!Array.isArray(friendTopics)) {
        throw new Error("Expected an array of topics");
      }
      setTopics(friendTopics as Topic[]);

      const friendDates = await DateStorage.getDatesByFriend(friendId);
      if (!Array.isArray(friendDates)) {
        throw new Error("Expected an array of dates");
      }
      setDates(friendDates as DateEntry[]);
    }

    if (friendId) fetchFriendData();
  }, [friendId, router]);

  const handleAddTopic = async () => {
    if (!newTopic.trim() || !friend) return;

    const newTopicEntry: Topic = {
      id: uuidv4(),
      friendId: friend.id,
      content: newTopic,
      type: topicType,
      status: topicType === "action" ? "Pending" : undefined,
      createdAt: new Date().toISOString(),
    };

    await TopicStorage.addTopic(newTopicEntry);
    const updatedTopics = await TopicStorage.getTopicsByFriend(friend.id);
    if (!Array.isArray(updatedTopics)) {
      throw new Error("Expected an array of topics");
    }
    setTopics(updatedTopics as Topic[]);
    setNewTopic('');
  };

  const handleAddDate = async () => {
    if (!newDateTitle.trim() || !newDate.trim() || !friend) return;

    const newDateEntry: DateEntry = {
      id: uuidv4(),
      friendId: friend.id,
      title: newDateTitle,
      date: newDate,
    };

    await DateStorage.addDate(newDateEntry);
    const updatedDates = await DateStorage.getDatesByFriend(friend.id);
    if (!Array.isArray(updatedDates)) {
      throw new Error("Expected an array of dates");
    }
    setDates(updatedDates as DateEntry[]);
    setNewDateTitle('');
    setNewDate('');
  };

  return (
    <div className={`container mx-auto p-4 ${friend?.color}`}> 
      <h1 className="text-2xl font-bold mb-4">{friend?.name}</h1>

      {/* Topics Section */}
      <h2 className="text-xl font-semibold mt-6">Topics</h2>
      <div className="mt-4">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div key={topic.id} className="card p-4">
              <p className="text-gray-800 dark:text-gray-200">{topic.content}</p>
              <small className="text-gray-500 dark:text-gray-400">{new Date(topic.createdAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No topics recorded yet.</p>
        )}
      </div>
      <select value={topicType} onChange={(e) => setTopicType(e.target.value as "general" | "action")} className="border p-2 rounded">
        <option value="general">General Topic</option>
        <option value="action">Action Item</option>
      </select>
      <textarea
        placeholder="Write a new topic..."
        value={newTopic}
        onChange={(e) => setNewTopic(e.target.value)}
        className="border p-2 rounded w-full h-24"
      />
      <button onClick={handleAddTopic} className="btn btn-primary mt-2">Add Topic</button>

      {/* Dates Section */}
      <h2 className="text-xl font-semibold mt-6">Important Dates</h2>
      <input
        type="text"
        placeholder="Event Title"
        value={newDateTitle}
        onChange={(e) => setNewDateTitle(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={handleAddDate} className="btn btn-primary mt-2">Add Date</button>

      <div className="mt-4 space-y-2">
        {dates.length > 0 ? (
          dates.map((entry) => (
            <div key={entry.id} className="card flex justify-between p-4">
              <span>{entry.title} - {new Date(entry.date).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p>No dates recorded yet.</p>
        )}
      </div>
    </div>
  );
}
