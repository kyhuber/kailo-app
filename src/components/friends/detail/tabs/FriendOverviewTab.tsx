// src/components/friends/detail/tabs/FriendOverviewTab.tsx
import React, { useState } from 'react';
import { Note } from '@/utils/notes_storage';
import { Topic } from '@/utils/topics_storage';
import { Task } from '@/utils/tasks_storage';
import { ImportantDate } from '@/utils/dates_storage';
import EmptyState from '../EmptyState';
import { AiOutlinePlus } from 'react-icons/ai';
import ItemDetailModal, { GenericItem } from '@/components/shared/ItemDetailModal';

interface FriendOverviewTabProps {
  notes: Note[];
  topics: Topic[];
  tasks: Task[];
  dates: ImportantDate[];
  friendId: string;
  setActiveTab: (tab: 'overview' | 'notes' | 'topics' | 'tasks' | 'dates') => void;
  onOpenModal: (type: 'note' | 'topic' | 'task' | 'date') => void;
  onUpdateNote?: (note: Note) => void;
  onUpdateTopic?: (topic: Topic) => void;
  onUpdateTask?: (task: Task) => void;
  onUpdateDate?: (date: ImportantDate) => void;
}

export default function FriendOverviewTab({ 
  notes, 
  topics, 
  tasks, 
  dates, 
  friendId,
  setActiveTab, 
  onOpenModal,
  onUpdateNote,
  onUpdateTopic,
  onUpdateTask,
  onUpdateDate
}: FriendOverviewTabProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<ImportantDate | null>(null);

  const activeNotes = notes.filter(note => note.status === 'Active');
  const activeTopics = topics.filter(topic => topic.status === 'Active');
  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const upcomingDates = dates.filter(date => new Date(date.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleUpdate = (item: GenericItem) => {
    if ('content' in item && 'status' in item) {
      if (onUpdateNote && selectedNote) {
        onUpdateNote(item as Note);
      } else if (onUpdateTopic && selectedTopic) {
        onUpdateTopic(item as Topic);
      } else if (onUpdateTask && selectedTask) {
        onUpdateTask(item as Task);
      }
    } else if ('title' in item && 'date' in item && onUpdateDate) {
      onUpdateDate(item as ImportantDate);
    }
    
    // Reset all selected states
    setSelectedNote(null);
    setSelectedTopic(null);
    setSelectedTask(null);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Recent Notes</h2>
          <button
            onClick={() => onOpenModal('note')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
          >
            <AiOutlinePlus /> Add Note
          </button>
        </div>
        {activeNotes.length > 0 ? (
          <>
            {activeNotes.slice(0, 3).map(note => (
              <div 
                key={note.id} 
                onClick={() => setSelectedNote(note)}
                className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <p>{note.content}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('notes');
                  }}
                  className="text-blue-500 text-xs px-2 py-1 rounded"
                >
                  View
                </button>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
          >
            <AiOutlinePlus /> Add Topic
          </button>
        </div>
        {activeTopics.length > 0 ? (
          <>
            {activeTopics.slice(0, 3).map(topic => (
              <div 
                key={topic.id} 
                onClick={() => setSelectedTopic(topic)}
                className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
          >
            <AiOutlinePlus /> Add Task
          </button>
        </div>
        {pendingTasks.length > 0 ? (
          <>
            {pendingTasks.slice(0, 3).map(task => (
              <div 
                key={task.id} 
                onClick={() => setSelectedTask(task)}
                className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div>
                  <p>{task.content}</p>
                  {task.priority === 'High' && (
                    <span className="text-xs text-red-500 font-semibold">High Priority</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('tasks');
                  }}
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
          >
            <AiOutlinePlus /> Add Date
          </button>
        </div>
        {upcomingDates.length > 0 ? (
          <>
            {upcomingDates.slice(0, 3).map(date => (
              <div 
                key={date.id} 
                onClick={() => setSelectedDate(date)}
                className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <p className="font-medium">{date.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(date.date).toLocaleDateString()}
                  {date.endDate && ` - ${new Date(date.endDate).toLocaleDateString()}`}
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

      {/* Modals for item details */}
      {selectedNote && (
        <ItemDetailModal
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          item={selectedNote}
          itemType="note"
          onDelete={() => {
            setSelectedNote(null);
            setActiveTab('notes'); // Redirect to notes tab for deletion management
          }}
          onUpdate={handleUpdate}
          onStatusChange={() => {
            setSelectedNote(null);
            setActiveTab('notes'); // Redirect to notes tab for status management
          }}
          friendId={friendId}
        />
      )}

      {selectedTopic && (
        <ItemDetailModal
          isOpen={!!selectedTopic}
          onClose={() => setSelectedTopic(null)}
          item={selectedTopic}
          itemType="topic"
          onDelete={() => {
            setSelectedTopic(null);
            setActiveTab('topics');
          }}
          onUpdate={handleUpdate}
          onStatusChange={() => {
            setSelectedTopic(null);
            setActiveTab('topics');
          }}
          friendId={friendId}
        />
      )}

      {selectedTask && (
        <ItemDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          item={selectedTask}
          itemType="task"
          onDelete={() => {
            setSelectedTask(null);
            setActiveTab('tasks');
          }}
          onUpdate={handleUpdate}
          onStatusChange={() => {
            setSelectedTask(null);
            setActiveTab('tasks');
          }}
          friendId={friendId}
        />
      )}

      {selectedDate && (
        <ItemDetailModal
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          item={selectedDate}
          itemType="date"
          onDelete={() => {
            setSelectedDate(null);
            setActiveTab('dates');
          }}
          onUpdate={handleUpdate}
          onStatusChange={() => {
            setSelectedDate(null);
            setActiveTab('dates');
          }}
          friendId={friendId}
        />
      )}
    </div>
  );
}