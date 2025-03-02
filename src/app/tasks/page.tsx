// src/app/tasks/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TaskStorage, Task } from '@/utils/tasks_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import AddTaskForm from '@/components/friends/detail/forms/AddTaskForm';
import ManageableItemList, { ItemStatus } from '@/components/shared/ManageableItemList';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [friends, setFriends] = useState<Record<string, Friend>>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'archived'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Load all tasks
        const allTasks = await TaskStorage.getAll();
        if (Array.isArray(allTasks)) {
          setTasks(allTasks);
        }

        // Load all friends for reference
        const allFriends = await FriendStorage.getAll() as Friend[];
        if (Array.isArray(allFriends)) {
          const friendsMap: Record<string, Friend> = {};
          allFriends.forEach(friend => {
            friendsMap[friend.id] = friend;
          });
          setFriends(friendsMap);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleUpdateTaskStatus = async (taskId: string, newStatus: ItemStatus) => {
    await TaskStorage.updateTaskStatus(taskId, newStatus);
    const completedAt = new Date().toISOString();
    if (newStatus === 'Complete') {
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: completedAt, completedAt }
          : task
      ));
    } else {
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      ));
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => task.status === 'Pending')
          .sort((a, b) => a.priority === 'High' ? -1 : b.priority === 'High' ? 1 : 0);
      case 'completed':
        return tasks.filter(task => task.status === 'Complete');
      case 'archived':
        return tasks.filter(task => task.status === 'Archived');
      default:
        return tasks
          .sort((a, b) => {
            // Sort by priority first
            if (a.priority === 'High' && b.priority !== 'High') return -1;
            if (a.priority !== 'High' && b.priority === 'High') return 1;

            // Then by creation date (newest first)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
    }
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="mt-2">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-4 py-2 rounded-md ${filter === 'archived' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <ManageableItemList<Task>
        title={filter === 'all' ? "All Tasks" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks`}
        description={filter === 'all' ? "Tasks are action items related to your friendships that you need to complete." : `These are the ${filter} tasks.`}
        addItemButtonLabel="Add Task"
        items={filter === 'all' ? tasks : filteredTasks}
        setItems={setTasks}
        CardComponent={({ item, onArchive, onComplete, onReopen, onRestore, isArchived }) => {
          return (
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${item.priority === 'High' ? 'border-l-4 border-red-500' : ''
              }`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <div className="flex items-center">
                    <p className={item.status === 'Complete' ? 'line-through' : ''}>
                      {item.content}
                    </p>
                    {item.priority === 'High' && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        High Priority
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <Link
                      href={`/friends/${item.friendId}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {friends[item.friendId]?.name || 'Unknown Friend'}
                    </Link>
                    <span className="mx-2">•</span>
                    <span>
                      {item.status === 'Complete'
                        ? `Completed on ${new Date(item.updatedAt).toLocaleDateString()}`
                        : `Created on ${new Date(item.createdAt).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {item.status === 'Pending' && onComplete && (
                    <button
                      onClick={() => onComplete(item.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Complete
                    </button>
                  )}
                  {item.status === 'Complete' && onReopen && (
                    <button
                      onClick={() => onReopen(item.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Reopen
                    </button>
                  )}
                  {!isArchived && onArchive && (
                    <button
                      onClick={() => onArchive(item.id)}
                      className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
                    >
                      Archive
                    </button>
                  )}
                  {isArchived && onRestore && (
                    <button
                      onClick={() => onRestore(item.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        }}
        AddFormComponent={({ isOpen, onClose, onAdded }) => (
          <AddTaskForm
            onTaskAdded={onAdded}
            isOpen={isOpen}
            onClose={onClose}
            friends={Object.values(friends)}
          />
        )}
        onUpdateStatus={handleUpdateTaskStatus}
        emptyMessage={filter === 'all' ? "No tasks yet." : `No ${filter} tasks.`}
      />
    </div>
  );
}
