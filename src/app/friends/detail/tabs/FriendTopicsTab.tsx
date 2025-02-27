// src/components/friends/detail/tabs/FriendTopicsTab.tsx
import React, { useState } from 'react';
import { Topic, TopicStorage } from '@/utils/topics_storage';
import TopicCard from '../cards/TopicCard';
import AddTopicForm from '../forms/AddTopicForm';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface FriendTopicsTabProps {
  friendId: string;
  topics: Topic[];
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
}

export default function FriendTopicsTab({ friendId, topics, setTopics }: FriendTopicsTabProps) {
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [topicToArchive, setTopicToArchive] = useState<string | null>(null);
  const [topicToRestore, setTopicToRestore] = useState<string | null>(null);
  
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
    setTopicToArchive(null);
  };

  const handleRestoreTopic = async (topicId: string) => {
    await TopicStorage.updateTopicStatus(topicId, 'Active');
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, status: 'Active', updatedAt: new Date().toISOString() } : topic
    ));
    setTopicToRestore(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Conversation Topics</h2>
        <button 
          onClick={() => setIsAddTopicModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Add Topic
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Topics are conversation points to discuss with your friend during your next interaction.
      </p>
      
      {/* Active Topics */}
      <h3 className="font-medium text-lg mb-3">Active Topics</h3>
      {activeTopics.length > 0 ? (
        <div className="space-y-3 mb-6">
          {activeTopics.map(topic => (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              onArchive={() => setTopicToArchive(topic.id)} 
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          No active topics yet. Add topics you want to discuss with your friend.
        </p>
      )}

      {/* Archived Topics */}
      {archivedTopics.length > 0 && (
        <>
          <h3 className="font-medium text-lg mb-3">Archived Topics</h3>
          <div className="space-y-3">
            {archivedTopics.map(topic => (
              <TopicCard 
                key={topic.id} 
                topic={topic} 
                onRestore={() => setTopicToRestore(topic.id)}
                isArchived
              />
            ))}
          </div>
        </>
      )}
      
      {/* Modals */}
      <AddTopicForm 
        friendId={friendId} 
        onTopicAdded={handleAddTopic} 
        isOpen={isAddTopicModalOpen}
        onClose={() => setIsAddTopicModalOpen(false)}
      />
      
      <ConfirmModal
        isOpen={!!topicToArchive}
        onClose={() => setTopicToArchive(null)}
        onConfirm={() => topicToArchive && handleArchiveTopic(topicToArchive)}
        title="Archive Topic"
        message="Are you sure you want to archive this conversation topic? You can restore it later if needed."
        confirmButtonText="Archive"
        variant="warning"
      />
      
      <ConfirmModal
        isOpen={!!topicToRestore}
        onClose={() => setTopicToRestore(null)}
        onConfirm={() => topicToRestore && handleRestoreTopic(topicToRestore)}
        title="Restore Topic"
        message="Do you want to restore this conversation topic to active status?"
        confirmButtonText="Restore"
        variant="info"
      />
    </div>
  );
}