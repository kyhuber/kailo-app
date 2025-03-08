// src/components/friends/detail/tabs/FriendTopicsTab.tsx
import React, { useState } from 'react';
import { ItemStatus } from '@/types/shared';
import { Topic, TopicStorage } from '@/utils/topics_storage';
import TopicCard from '../cards/TopicCard';
import AddTopicForm from '../forms/AddTopicForm';
import ManageableItemList from '@/components/shared/ManageableItemList';
import ItemDetailModal, { GenericItem} from '@/components/shared/ItemDetailModal';

interface FriendTopicsTabProps {
  friendId: string;
  topics: Topic[];
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
}

export default function FriendTopicsTab({ friendId, topics, setTopics }: FriendTopicsTabProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleTopicUpdated = (updatedTopic: Topic | GenericItem) => {
    setTopics(prev => prev.map(topic => topic.id === updatedTopic.id ? updatedTopic : topic));
    setSelectedTopic(null);
  };

  const handleDeleteTopic = async (topicId: string) => {
    await TopicStorage.deleteItem(topicId);
    setTopics(prev => prev.filter(topic => topic.id !== topicId));
  };

  const handleStatusChange = async (topicId: string, status: string) => {
    await TopicStorage.updateTopicStatus(topicId, status as ItemStatus);
    setTopics(topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, status: status as ItemStatus, updatedAt: new Date().toISOString() } 
        : topic
    ));
    setSelectedTopic(null);
  };

  return (
    <>
      <ManageableItemList<Topic>
        title="Conversation Topics"
        description="Topics are conversation points to discuss with your friend during your next interaction."
        addItemButtonLabel="Add Topic"
        items={topics}
        setItems={setTopics}
        CardComponent={({ item, onArchive, onRestore, isArchived, onComplete, isCompleted, onReopen }) => (
          <TopicCard
            item={item}
            onArchive={onArchive}
            onRestore={onRestore}
            isArchived={isArchived}
            isCompleted={isCompleted}
            onComplete={onComplete}
            onReopen={onReopen}
            onClick={(topic) => setSelectedTopic(topic as Topic)}
          />
        )}
        AddFormComponent={({ isOpen, onClose, onAdded }) => (
          <AddTopicForm
            friendId={friendId}
            isOpen={isOpen}
            onClose={onClose}
            onTopicAdded={onAdded}
          />
        )}
        onUpdateStatus={TopicStorage.updateTopicStatus}
        emptyMessage="No active topics yet. Add topics you want to discuss with your friend."
      />

      <ItemDetailModal
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        item={selectedTopic}
        itemType="topic"
        onDelete={handleDeleteTopic}
        onUpdate={(item) => handleTopicUpdated(item as Topic)}
        onStatusChange={handleStatusChange}
        friendId={friendId}
      />
    </>
  );
}