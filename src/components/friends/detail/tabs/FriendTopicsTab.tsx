// src/components/friends/detail/tabs/FriendTopicsTab.tsx
import React from 'react';
import { Topic, TopicStorage } from '@/utils/topics_storage';
import TopicCard from '../cards/TopicCard';
import AddTopicForm from '../forms/AddTopicForm';
import ManageableItemList from '@/components/shared/ManageableItemList';

interface FriendTopicsTabProps {
  friendId: string;
  topics: Topic[];
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
}

export default function FriendTopicsTab({ friendId, topics, setTopics }: FriendTopicsTabProps) {

  return (
    <ManageableItemList<Topic>
      title="Conversation Topics"
      description="Topics are conversation points to discuss with your friend during your next interaction."
      addItemButtonLabel="Add Topic"
      items={topics}
      setItems={setTopics}
      CardComponent={TopicCard}
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
  );
}
