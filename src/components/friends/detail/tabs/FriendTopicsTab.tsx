// src/components/friends/detail/tabs/FriendTopicsTab.tsx
import React from 'react';
import { Topic, TopicStorage } from '@/utils/topics_storage';
import TopicCard from '../cards/TopicCard';
import AddTopicForm from '../forms/AddTopicForm';

interface FriendTopicsTabProps {
  friendId: string;
  topics: Topic[];
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
}

export default function FriendTopicsTab({ friendId, topics, setTopics }: FriendTopicsTabProps) {
  const activeTopics = topics.filter(topic => topic.status === 'Active');
  const archivedTopics = topics.filter(topic => topic.status === 'Archived');

  const handleAddTopic = (newTopic: Topic) => {
    setTopics(prev => [...prev, newTopic]);
  };

  const handleArchiveTopic = async (topicId: string) => {
    await TopicStorage.updateTopicStatus(topicId, 'Archived');
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, status: 'Archived', updatedAt: new Date().toISOString() } : topic
    ));
  };

  const handleRestoreTopic = async (topicId: string) => {
    await TopicStorage.updateTopicStatus(topicId, 'Active');
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, status: 'Active', updatedAt: new Date().toISOString() } : topic
    ));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Conversation Topics</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Topics are conversation points to discuss with your friend during your next interaction.
      </p>
      
      {/* Add Topic Form */}
      <AddTopicForm friendId={friendId} onTopicAdded={handleAddTopic} />

      {/* Active Topics */}
      <h3 className="font-medium text-lg mb-2">Active Topics</h3>
      {activeTopics.length > 0 ? (
        <div className="space-y-3 mb-6">
          {activeTopics.map(topic => (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              onArchive={handleArchiveTopic} 
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">No active topics yet.</p>
      )}

      {/* Archived Topics */}
      <h3 className="font-medium text-lg mb-2">Archived Topics</h3>
      {archivedTopics.length > 0 ? (
        <div className="space-y-3">
          {archivedTopics.map(topic => (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              onRestore={handleRestoreTopic}
              isArchived
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No archived topics.</p>
      )}
    </div>
  );
}