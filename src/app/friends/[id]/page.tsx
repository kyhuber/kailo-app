// src/app/friends/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { Note, NoteStorage } from '@/utils/notes_storage';
import { Topic, TopicStorage } from '@/utils/topics_storage';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';

import FriendHeader from '@/components/friends/detail/FriendHeader';
import TabNavigation from '@/components/friends/detail/TabNavigation';
import FriendOverviewTab from '@/components/friends/detail/tabs/FriendOverviewTab';
import FriendNotesTab from '@/components/friends/detail/tabs/FriendNotesTab';
import FriendTopicsTab from '@/components/friends/detail/tabs/FriendTopicsTab';
import FriendTasksTab from '@/components/friends/detail/tabs/FriendTasksTab';
import FriendDatesTab from '@/components/friends/detail/tabs/FriendDatesTab';

import AddNoteForm from '@/components/friends/detail/forms/AddNoteForm';
import AddTopicForm from '@/components/friends/detail/forms/AddTopicForm';
import AddTaskForm from '@/components/friends/detail/forms/AddTaskForm';
import AddDateForm from '@/components/friends/detail/forms/AddDateForm';

const getRandomColor = () => {
  const colorOptions = [
    'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
    'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100',
    'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100',
    'bg-rose-100 dark:bg-rose-900 text-rose-900 dark:text-rose-100',
    'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100',
    'bg-teal-100 dark:bg-teal-900 text-teal-900 dark:text-teal-100',
  ];
  return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};

export default function FriendDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const friendId = Array.isArray(id) ? id[0] : id || '';

  const [friend, setFriend] = useState<Friend | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'topics' | 'tasks' | 'dates'>('overview');

  // Data states
  const [notes, setNotes] = useState<Note[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddDateModalOpen, setIsAddDateModalOpen] = useState(false);

  useEffect(() => {
    async function fetchFriendData() {
      try {
        setLoading(true);
        const friendData = await FriendStorage.getById(friendId);
        if (friendData) {
          if (!friendData.color || !friendData.color.includes('text-')) {
            friendData.color = getRandomColor();
            await FriendStorage.updateItem(friendData);
          }
          setFriend(friendData);
        } else {
          router.push('/friends');
          return;
        }

        // Load all data for this friend
        const notesData = await NoteStorage.getNotesByFriend(friendId);
        setNotes(notesData);

        const topicsData = await TopicStorage.getTopicsByFriend(friendId);
        setTopics(topicsData);

        const tasksData = await TaskStorage.getTasksByFriend(friendId);
        setTasks(tasksData);

        const datesData = await DateStorage.getDatesByFriend(friendId);
        setDates(datesData);
      } catch (error) {
        console.error("Error loading friend data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (friendId) fetchFriendData();
  }, [friendId, router]);

  const handleOpenModal = (type: 'note' | 'topic' | 'task' | 'date') => {
    switch (type) {
      case 'note':
        setIsAddNoteModalOpen(true);
        break;
      case 'topic':
        setIsAddTopicModalOpen(true);
        break;
      case 'task':
        setIsAddTaskModalOpen(true);
        break;
      case 'date':
        setIsAddDateModalOpen(true);
        break;
    }
  };

  const handleCloseModal = (type: 'note' | 'topic' | 'task' | 'date') => {
    switch (type) {
        case 'note':
          setIsAddNoteModalOpen(false);
          break;
        case 'topic':
          setIsAddTopicModalOpen(false);
          break;
        case 'task':
          setIsAddTaskModalOpen(false);
          break;
        case 'date':
          setIsAddDateModalOpen(false);
          break;
      }
  }

  const handleUpdateNote = async (updatedNote: Note) => {
    await NoteStorage.updateItem(updatedNote);
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
  };

  const handleUpdateTopic = async (updatedTopic: Topic) => {
    await TopicStorage.updateItem(updatedTopic);
    setTopics(topics.map(topic => topic.id === updatedTopic.id ? updatedTopic : topic));
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    await TaskStorage.updateItem(updatedTask);
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleUpdateDate = async (updatedDate: ImportantDate) => {
    await DateStorage.updateDate(updatedDate);
    setDates(dates.map(date => date.id === updatedDate.id ? updatedDate : date));
  };

  if (loading || !friend) {
    return <div className="container mx-auto p-6 flex justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Hero Section */}
      <div className='mb-6'>
        <FriendHeader friend={friend} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === 'overview' && (
        <FriendOverviewTab
          notes={notes}
          topics={topics}
          tasks={tasks}
          dates={dates}
          friendId={friendId}
          setActiveTab={setActiveTab}
          onOpenModal={handleOpenModal}
          onUpdateNote={handleUpdateNote}
          onUpdateTopic={handleUpdateTopic}
          onUpdateTask={handleUpdateTask}
          onUpdateDate={handleUpdateDate}
        />
      )}

      {activeTab === 'notes' && (
        <FriendNotesTab
          friendId={friendId}
          notes={notes}
          setNotes={setNotes}
        />
      )}

      {activeTab === 'topics' && (
        <FriendTopicsTab
          friendId={friendId}
          topics={topics}
          setTopics={setTopics}
        />
      )}

      {activeTab === 'tasks' && (
        <FriendTasksTab
          friendId={friendId}
          tasks={tasks}
          setTasks={setTasks}
        />
      )}

      {activeTab === 'dates' && (
        <FriendDatesTab
          friendId={friendId}
          dates={dates}
          setDates={setDates}
        />
      )}

      {/* Modals */}
      <AddNoteForm
        friendId={friendId}
        isOpen={isAddNoteModalOpen}
        onClose={() => handleCloseModal('note')}
        onNoteAdded={(note) => setNotes(prev => [...prev, note])}
      />

      <AddTopicForm
        friendId={friendId}
        isOpen={isAddTopicModalOpen}
        onClose={() => handleCloseModal('topic')}
        onTopicAdded={(topic) => setTopics(prev => [...prev, topic])}
      />

      <AddTaskForm
        friendId={friendId}
        isOpen={isAddTaskModalOpen}
        onClose={() => handleCloseModal('task')}
        onTaskAdded={(task) => setTasks(prev => [...prev, task])}
      />

      <AddDateForm
        friendId={friendId}
        isOpen={isAddDateModalOpen}
        onClose={() => handleCloseModal('date')}
        onDateAdded={(date) => setDates(prev => [...prev, date])}
      />
    </div>
  );
}