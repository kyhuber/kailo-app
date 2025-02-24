'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FriendStorage } from '@/utils/friends_storage';
import { TopicStorage } from '@/utils/topics_storage';
import { DateStorage } from '@/utils/dates_storage';

interface Friend {
  id: string;
  name: string;
  contactInfo?: string;
  tags?: string[];
  color?: string;
}

const getRandomColor = () => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});
  const [futureDatesCounts, setFutureDatesCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchFriends() {
      const storedFriends = await FriendStorage.getFriends();
      if (!Array.isArray(storedFriends)) {
        throw new Error("Expected an array of friends");
      }
      const updatedFriends = storedFriends.map(friend => ({
        ...friend,
        color: friend.color || getRandomColor()
      }));
      setFriends(updatedFriends);

      const pendingTopics: Record<string, number> = {};
      const futureDates: Record<string, number> = {};

      for (const friend of storedFriends) {
        const topics = await TopicStorage.getTopicsByFriend(friend.id);
        if (!Array.isArray(topics)) {
          throw new Error("Expected an array of topics");
        }
        pendingTopics[friend.id] = topics.filter(topic => topic.status === 'Pending').length;

        const dates = await DateStorage.getDatesByFriend(friend.id);
        if (!Array.isArray(dates)) {
          throw new Error("Expected an array of dates");
        }
        const today = new Date().toISOString().split('T')[0];
        futureDates[friend.id] = dates.filter(date => date.date >= today).length;
      }

      setPendingCounts(pendingTopics);
      setFutureDatesCounts(futureDates);
    }
    fetchFriends();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>
      <Link href="/friends/new" className="btn btn-primary mb-4 inline-block">Add Friend</Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {friends.map((friend) => (
          <Link key={friend.id} href={`/friends/${friend.id}`} className="block">
            <div className={`card p-4 ${friend.color}`}>
              <h2 className="text-lg font-semibold">{friend.name}</h2>
              {friend.contactInfo && <p className="text-gray-600">{friend.contactInfo}</p>}
              {friend.tags && friend.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {friend.tags.map((tag) => (
                    <span key={tag} className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white text-xs font-semibold px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2 text-sm text-gray-600">
                <p>Pending Topics: {pendingCounts[friend.id] || 0}</p>
                <p>Upcoming Dates: {futureDatesCounts[friend.id] || 0}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
