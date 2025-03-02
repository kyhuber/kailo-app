// src/components/friends/detail/tabs/FriendOverviewTab.tsx
import React from 'react';
import { Note } from '@/utils/notes_storage';
import { Topic } from '@/utils/topics_storage';
import { Task } from '@/utils/tasks_storage';
import { ImportantDate } from '@/utils/dates_storage';
import EmptyState from '../EmptyState';
import { AiOutlinePlus } from 'react-icons/ai';

interface FriendOverviewTabProps {
  notes: Note[];
  topics: Topic[];
  tasks: Task[];
  dates: ImportantDate[];
  setActiveTab: (tab: 'overview' | 'notes' | 'topics' | 'tasks' | 'dates') => void;
  onOpenModal: (type: 'note' | 'topic' | 'task' | 'date') => void;
}

export default function FriendOverviewTab({ notes, topics, tasks, dates, setActiveTab, onOpenModal }: FriendOverviewTabProps) {
  const activeNotes = notes.filter(note => note.status === 'Active');
  const activeTopics = topics.filter(topic => topic.status === 'Active');
  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const upcomingDates = dates.filter(date => new Date(date.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Recent Notes</h2>
          <button
            onClick={() => onOpenModal('note')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1" // Changed to button styling
          >
            <AiOutlinePlus /> Add Note
          </button>
        </div>
        {activeNotes.length > 0 ? (
          <>
            {activeNotes.slice(0, 3).map(note => (
              <div key={note.id} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p>{note.content}</p>
              </div>
            ))}
            <button
              onClick={() => setActiveTab('notes')}
              className="text-blue-500 text-sm mt-2"
            >
              View all notes →
            </button>
          </>
        ) : (
          <EmptyState
            message="No notes yet"
            actionLabel="Add a note +"
            onAction={() => onOpenModal('note')}
          />
        )}
      </div>

      {/* Conversation Topics */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Conversation Topics</h2>
          <button
            onClick={() => onOpenModal('topic')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1" // Changed to button styling
          >
            <AiOutlinePlus /> Add Topic
          </button>
        </div>
        {activeTopics.length > 0 ? (
          <>
            {activeTopics.slice(0, 3).map(topic => (
              <div key={topic.id} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p>{topic.content}</p>
              </div>
            ))}
            <button
              onClick={() => setActiveTab('topics')}
              className="text-blue-500 text-sm mt-2"
            >
              View all topics →
            </button>
          </>
        ) : (
          <EmptyState
            message="No conversation topics yet"
            actionLabel="Add a topic +"
            onAction={() => onOpenModal('topic')}
          />
        )}
      </div>

      {/* Pending Tasks */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Pending Tasks</h2>
          <button
            onClick={() => onOpenModal('task')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1" // Changed to button styling
          >
            <AiOutlinePlus /> Add Task
          </button>
        </div>
        {pendingTasks.length > 0 ? (
          <>
            {pendingTasks.slice(0, 3).map(task => (
              <div key={task.id} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center">
                <div>
                  <p>{task.content}</p>
                  {task.priority === 'High' && (
                    <span className="text-xs text-red-500 font-semibold">High Priority</span>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-blue-500 text-xs px-2 py-1 rounded"
                >
                  View
                </button>
              </div>
            ))}
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-blue-500 text-sm mt-2"
            >
              View all tasks →
            </button>
          </>
        ) : (
          <EmptyState
            message="No pending tasks"
            actionLabel="Add a task +"
            onAction={() => onOpenModal('task')}
          />
        )}
      </div>

      {/* Upcoming Dates */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Upcoming Dates</h2>
          <button
            onClick={() => onOpenModal('date')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1" // Changed to button styling
          >
            <AiOutlinePlus /> Add Date
          </button>
        </div>
        {upcomingDates.length > 0 ? (
          <>
            {upcomingDates.slice(0, 3).map(date => (
              <div key={date.id} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-medium">{date.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(date.date).toLocaleDateString()}
                  {date.type === 'Recurring' && ' (Recurring)'}
                </p>
                {date.description && (
                  <p className="text-sm mt-1">{date.description}</p>
                )}
              </div>
            ))}
            <button
              onClick={() => setActiveTab('dates')}
              className="text-blue-500 text-sm mt-2"
            >
              View all dates →
            </button>
          </>
        ) : (
          <EmptyState
            message="No upcoming dates"
            actionLabel="Add a date +"
            onAction={() => onOpenModal('date')}
          />
        )}
      </div>
    </div>
  );
}
