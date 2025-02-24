// src/app/friends/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { Note, NoteStorage } from '@/utils/notes_storage';
import { Topic, TopicStorage } from '@/utils/topics_storage';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';
import { v4 as uuidv4 } from 'uuid';

const getRandomColor = () => {
  // Better contrast color combinations (background + text color classes)
  const colorOptions = [
    'bg-blue-200 dark:bg-blue-800',
    'bg-emerald-200 dark:bg-emerald-800',
    'bg-amber-200 dark:bg-amber-800',
    'bg-rose-200 dark:bg-rose-800',
    'bg-indigo-200 dark:bg-indigo-800',
    'bg-teal-200 dark:bg-teal-800',
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
  
  // Input states
  const [newNote, setNewNote] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newTask, setNewTask] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Normal' | 'High'>('Normal');
  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateType, setNewDateType] = useState<'One-time' | 'Recurring'>('One-time');
  const [newDate, setNewDate] = useState('');
  const [newDateDescription, setNewDateDescription] = useState('');

  useEffect(() => {
    async function fetchFriendData() {
      try {
        const friendData = await FriendStorage.getFriend(friendId);
        if (friendData) {
          // If color exists but doesn't have text color class, update it
          if (!friendData.color || !friendData.color.includes('text-')) {
            friendData.color = getRandomColor();
            await FriendStorage.updateFriend(friendData);
          }
          setFriend(friendData);
        } else {
          router.push('/friends');
          return;
        }

        // Load all data for this friend
        const notesData = await NoteStorage.getNotesByFriend(friendId);
        setNotes(notesData || []);

        const topicsData = await TopicStorage.getTopicsByFriend(friendId);
        setTopics(topicsData || []);

        const tasksData = await TaskStorage.getTasksByFriend(friendId);
        setTasks(tasksData || []);

        const datesData = await DateStorage.getDatesByFriend(friendId);
        setDates(datesData || []);
      } catch (error) {
        console.error("Error loading friend data:", error);
      }
    }

    if (friendId) fetchFriendData();
  }, [friendId, router]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !friend) return;

    const note: Note = {
      id: uuidv4(),
      friendId: friend.id,
      content: newNote,
      status: "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await NoteStorage.addNote(note);
    setNotes([...notes, note]);
    setNewNote('');
  };

  const handleAddTopic = async () => {
    if (!newTopic.trim() || !friend) return;

    const topic: Topic = {
      id: uuidv4(),
      friendId: friend.id,
      content: newTopic,
      status: "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await TopicStorage.addTopic(topic);
    setTopics([...topics, topic]);
    setNewTopic('');
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !friend) return;

    const task: Task = {
      id: uuidv4(),
      friendId: friend.id,
      content: newTask,
      status: "Pending",
      priority: taskPriority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await TaskStorage.addTask(task);
    setTasks([...tasks, task]);
    setNewTask('');
    setTaskPriority('Normal');
  };

  const handleAddDate = async () => {
    if (!newDateTitle.trim() || !newDate || !friend) return;

    const dateEntry: ImportantDate = {
      id: uuidv4(),
      friendId: friend.id,
      title: newDateTitle,
      date: newDate,
      type: newDateType,
      description: newDateDescription || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await DateStorage.addDate(dateEntry);
    setDates([...dates, dateEntry]);
    setNewDateTitle('');
    setNewDate('');
    setNewDateType('One-time');
    setNewDateDescription('');
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: "Pending" | "Complete" | "Archived") => {
    await TaskStorage.updateTaskStatus(taskId, newStatus);
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleUpdateNoteStatus = async (noteId: string, newStatus: "Active" | "Archived") => {
    await NoteStorage.updateNoteStatus(noteId, newStatus);
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, status: newStatus } : note
    ));
  };

  const handleUpdateTopicStatus = async (topicId: string, newStatus: "Active" | "Archived") => {
    await TopicStorage.updateTopicStatus(topicId, newStatus);
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, status: newStatus } : topic
    ));
  };

  if (!friend) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className={`p-6 rounded-lg shadow-md mb-6 ${friend.color || 'bg-blue-200 dark:bg-blue-800'}`}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {friend.name}
        </h1>
        {friend.contactInfo && (
          <p className="text-gray-700 dark:text-gray-200 mt-2">
            {friend.contactInfo}
          </p>
        )}
        {friend.tags && friend.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {friend.tags.map((tag) => (
              <span 
                key={tag} 
                className="bg-white bg-opacity-70 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 ${activeTab === 'notes' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Notes
        </button>
        <button 
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2 ${activeTab === 'topics' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Topics
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 ${activeTab === 'tasks' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Tasks
        </button>
        <button 
          onClick={() => setActiveTab('dates')}
          className={`px-4 py-2 ${activeTab === 'dates' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Dates
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Notes */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Recent Notes</h2>
              {notes.filter(note => note.status === 'Active').slice(0, 3).map(note => (
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
            </div>

            {/* Active Topics */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Conversation Topics</h2>
              {topics.filter(topic => topic.status === 'Active').slice(0, 3).map(topic => (
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
            </div>

            {/* Pending Tasks */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Pending Tasks</h2>
              {tasks.filter(task => task.status === 'Pending').slice(0, 3).map(task => (
                <div key={task.id} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center">
                  <div>
                    <p>{task.content}</p>
                    {task.priority === 'High' && (
                      <span className="text-xs text-red-500 font-semibold">High Priority</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleUpdateTaskStatus(task.id, 'Complete')}
                    className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Complete
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setActiveTab('tasks')} 
                className="text-blue-500 text-sm mt-2"
              >
                View all tasks →
              </button>
            </div>

            {/* Upcoming Dates */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Upcoming Dates</h2>
              {dates
                .filter(date => new Date(date.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 3)
                .map(date => (
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
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">General Notes</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Notes are general reference information about friends that doesn&#39;t change frequently.
          </p>
          
          {/* Add Note Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-2">Add a New Note</h3>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note about your friend..."
              className="w-full p-2 border rounded dark:bg-gray-700 mb-2"
              rows={3}
            />
            <button 
              onClick={handleAddNote}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Note
            </button>
          </div>

          {/* Active Notes */}
          <h3 className="font-medium text-lg mb-2">Active Notes</h3>
          {notes.filter(note => note.status === 'Active').length > 0 ? (
            <div className="space-y-3 mb-6">
              {notes
                .filter(note => note.status === 'Active')
                .map(note => (
                  <div key={note.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between">
                    <div>
                      <p>{note.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Added on {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleUpdateNoteStatus(note.id, 'Archived')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Archive
                    </button>
                  </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No active notes yet.</p>
          )}

          {/* Archived Notes */}
          <h3 className="font-medium text-lg mb-2">Archived Notes</h3>
          {notes.filter(note => note.status === 'Archived').length > 0 ? (
            <div className="space-y-3">
              {notes
                .filter(note => note.status === 'Archived')
                .map(note => (
                  <div key={note.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow flex justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Archived on {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleUpdateNoteStatus(note.id, 'Active')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Restore
                    </button>
                  </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No archived notes.</p>
          )}
        </div>
      )}

      {/* Topics Tab */}
      {activeTab === 'topics' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Conversation Topics</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Topics are conversation points to discuss with your friend during your next interaction.
          </p>
          
          {/* Add Topic Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-2">Add a New Topic</h3>
            <textarea
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add something you want to discuss..."
              className="w-full p-2 border rounded dark:bg-gray-700 mb-2"
              rows={3}
            />
            <button 
              onClick={handleAddTopic}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Topic
            </button>
          </div>

          {/* Active Topics */}
          <h3 className="font-medium text-lg mb-2">Active Topics</h3>
          {topics.filter(topic => topic.status === 'Active').length > 0 ? (
            <div className="space-y-3 mb-6">
              {topics
                .filter(topic => topic.status === 'Active')
                .map(topic => (
                  <div key={topic.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between">
                    <div>
                      <p>{topic.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Added on {new Date(topic.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleUpdateTopicStatus(topic.id, 'Archived')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Archive
                    </button>
                  </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No active topics yet.</p>
          )}

          {/* Archived Topics */}
          <h3 className="font-medium text-lg mb-2">Archived Topics</h3>
          {topics.filter(topic => topic.status === 'Archived').length > 0 ? (
            <div className="space-y-3">
              {topics
                .filter(topic => topic.status === 'Archived')
                .map(topic => (
                  <div key={topic.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow flex justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">{topic.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Archived on {new Date(topic.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleUpdateTopicStatus(topic.id, 'Active')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Restore
                    </button>
                  </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No archived topics.</p>
          )}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Tasks are action items related to your friendship that you need to complete.
          </p>
          
          {/* Add Task Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-2">Add a New Task</h3>
            <textarea
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task you need to complete..."
              className="w-full p-2 border rounded dark:bg-gray-700 mb-2"
              rows={2}
            />
            <div className="flex items-center mb-2">
              <label className="mr-3">Priority:</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as 'Normal' | 'High')}
                className="p-2 border rounded dark:bg-gray-700"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>
            <button 
              onClick={handleAddTask}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>

          {/* Pending Tasks */}
          <h3 className="font-medium text-lg mb-2">Pending Tasks</h3>
          {tasks.filter(task => task.status === 'Pending').length > 0 ? (
            <div className="space-y-3 mb-6">
              {tasks
                .filter(task => task.status === 'Pending')
                .sort((a, b) => a.priority === 'High' ? -1 : b.priority === 'High' ? 1 : 0)
                .map(task => (
                  <div 
                    key={task.id} 
                    className={`p-4 rounded-lg shadow flex justify-between ${
                      task.priority === 'High' 
                        ? 'bg-red-50 dark:bg-red-900 border-l-4 border-red-500' 
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div>
                      <p>{task.content}</p>
                      {task.priority === 'High' && (
                        <span className="text-xs text-red-500 font-semibold">High Priority</span>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Added on {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleUpdateTaskStatus(task.id, 'Complete')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Complete
                      </button>
                      <button 
                        onClick={() => handleUpdateTaskStatus(task.id, 'Archived')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No pending tasks.</p>
          )}

          {/* Completed Tasks */}
          <h3 className="font-medium text-lg mb-2">Completed Tasks</h3>
          {tasks.filter(task => task.status === 'Complete').length > 0 ? (
            <div className="space-y-3 mb-6">
              {tasks
                .filter(task => task.status === 'Complete')
                .map(task => (
                  <div key={task.id} className="bg-green-50 dark:bg-green-900 p-4 rounded-lg shadow flex justify-between">
                    <div>
                      <p className="line-through">{task.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Completed on {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleUpdateTaskStatus(task.id, 'Archived')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Archive
                    </button>
                  </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No completed tasks.</p>
          )}

          {/* Archived Tasks */}
          <h3 className="font-medium text-lg mb-2">Archived Tasks</h3>
          {tasks.filter(task => task.status === 'Archived').length > 0 ? (
            <div className="space-y-3">
              {tasks
                .filter(task => task.status === 'Archived')
                .map(task => (
                  <div key={task.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow flex justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">{task.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Archived on {new Date(task.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleUpdateTaskStatus(task.id, 'Pending')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Restore
                    </button>
                  </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No archived tasks.</p>
          )}
        </div>
      )}

      {/* Dates Tab */}
      {activeTab === 'dates' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Important Dates</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Track birthdays, events, and other significant dates related to your friend.
          </p>
          
          {/* Add Date Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-2">Add a New Date</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  value={newDateTitle}
                  onChange={(e) => setNewDateTitle(e.target.value)}
                  placeholder="e.g., Birthday, Anniversary"
                  className="w-full p-2 border rounded dark:bg-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Type</label>
                <select
                  value={newDateType}
                  onChange={(e) => setNewDateType(e.target.value as 'One-time' | 'Recurring')}
                  className="w-full p-2 border rounded dark:bg-gray-700"
                >
                  <option value="One-time">One-time Event</option>
                  <option value="Recurring">Recurring (Annual)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Description (Optional)</label>
                <textarea
                  value={newDateDescription}
                  onChange={(e) => setNewDateDescription(e.target.value)}
                  placeholder="Add additional details..."
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  rows={2}
                />
              </div>
              
              <button 
                onClick={handleAddDate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Date
              </button>
            </div>
          </div>

          {/* Upcoming Dates */}
          <h3 className="font-medium text-lg mb-2">Upcoming Dates</h3>
          {dates.filter(date => new Date(date.date) >= new Date()).length > 0 ? (
            <div className="space-y-3 mb-6">
              {dates
                .filter(date => new Date(date.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(date => (
                  <div key={date.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{date.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(date.date).toLocaleDateString()} 
                          {date.type === 'Recurring' && ' (Recurring)'}
                        </p>
                        {date.description && (
                          <p className="text-sm mt-1">{date.description}</p>
                        )}
                      </div>
                      <div className="text-sm">
                        {Math.ceil((new Date(date.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No upcoming dates.</p>
          )}

          {/* Past Dates */}
          <h3 className="font-medium text-lg mb-2">Past Dates</h3>
          {dates.filter(date => new Date(date.date) < new Date()).length > 0 ? (
            <div className="space-y-3">
              {dates
                .filter(date => new Date(date.date) < new Date())
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(date => (
                  <div key={date.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h4 className="font-medium">{date.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(date.date).toLocaleDateString()} 
                      {date.type === 'Recurring' && ' (Recurring)'}
                    </p>
                    {date.description && (
                      <p className="text-sm mt-1">{date.description}</p>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No past dates.</p>
          )}
        </div>
      )}
    </div>
  );
}