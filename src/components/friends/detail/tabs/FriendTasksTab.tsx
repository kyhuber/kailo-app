// src/components/friends/detail/tabs/FriendTasksTab.tsx
import React from 'react';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import TopicCard from '../cards/TopicCard';
import AddTaskForm from '../forms/AddTaskForm';
import ManageableItemList from '@/components/shared/ManageableItemList';

interface FriendTasksTabProps {
  friendId: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function FriendTasksTab({ friendId, tasks, setTasks }: FriendTasksTabProps) {

  return (
    <ManageableItemList<Task>
      title="Tasks"
      description="Tasks are action items related to your friendship that you need to complete."
      addItemButtonLabel="Add Task"
      items={tasks}
      setItems={setTasks}
      CardComponent={TopicCard}
      AddFormComponent={({ isOpen, onClose, onAdded }) => (
        <AddTaskForm
          friendId={friendId}
          isOpen={isOpen}
          onClose={onClose}
          onTaskAdded={onAdded}
        />
      )}
      onUpdateStatus={TaskStorage.updateTaskStatus}
      emptyMessage="No pending tasks. Great job!"
      isCompletedList
      pendingSort={(a, b) => a.priority === 'High' ? -1 : b.priority === 'High' ? 1 : 0}
    />
  );
}
