// src/app/tasks/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TaskStorage, Task } from '@/utils/tasks_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import AddTaskForm from '@/components/friends/detail/forms/AddTaskForm';
import { ItemStatus } from '@/types/shared';
import ProtectedRoute from '@/components/ProtectedRoute';
import ItemDetailModal, {GenericItem} from '@/components/shared/ItemDetailModal';
import { AiOutlineCheckCircle, AiOutlinePlus } from 'react-icons/ai';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [friends, setFriends] = useState<Record<string, Friend>>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'archived'>('pending');
  const [loading, setLoading] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    setIsAddTaskModalOpen(false);
  };

  const handleUpdateTask = (updatedTask: GenericItem) => {
    const taskItem = updatedTask as Task;
    setTasks(prev => prev.map(task => task.id === taskItem.id ? taskItem : task));
    setSelectedTask(null); // Close modal after update
  };

  const handleDeleteTask = async (taskId: string) => {
    await TaskStorage.deleteItem(taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setSelectedTask(null);
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        status: status as ItemStatus,
        updatedAt: new Date().toISOString()
      };
      
      // If status is changing to complete, add completedAt
      if (status === 'Complete') {
        updatedTask.completedAt = new Date().toISOString();
      }
      
      await TaskStorage.updateTaskStatus(taskId, status as ItemStatus);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      setSelectedTask(null); // Close the modal after status change
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
            // Sort by status first (Pending first, then Complete, then Archived)
            const statusOrder = { Pending: 0, Complete: 1, Archived: 2 };
            const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
            if (statusDiff !== 0) return statusDiff;
            
            // For pending tasks, sort by priority
            if (a.status === 'Pending' && b.status === 'Pending') {
              if (a.priority === 'High' && b.priority !== 'High') return -1;
              if (a.priority !== 'High' && b.priority === 'High') return 1;
            }
            
            // Finally sort by creation date (newest first)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
    }
  };

  const filteredTasks = getFilteredTasks();
  const hasTasks = filteredTasks.length > 0;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 text-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tasks</h1>
          <button 
            onClick={() => setIsAddTaskModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
          >
            <AiOutlinePlus className="h-5 w-5" />
            Add Task
          </button>
        </div>
        
        {/* Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md font-medium ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md font-medium ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`px-4 py-2 rounded-md font-medium ${filter === 'archived' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              Archived
            </button>
          </div>
        </div>
        
        {!hasTasks ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                <AiOutlineCheckCircle className="h-12 w-12" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              {filter === 'all' 
                ? "No tasks yet" 
                : filter === 'pending'
                ? "No pending tasks" 
                : filter === 'completed'
                ? "No completed tasks" 
                : "No archived tasks"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {filter === 'all' || filter === 'pending' 
                ? "Add tasks to keep track of things you need to do for your friends."
                : filter === 'completed'
                ? "Complete some tasks to see them here."
                : "Archive tasks you no longer need to see them here."}
            </p>
            {(filter === 'all' || filter === 'pending') && (
              <button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
              >
                <AiOutlinePlus className="h-5 w-5" />
                Add Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition ${
                  task.priority === 'High' && task.status === 'Pending' ? 'border-l-4 border-red-500' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <p className={task.status === 'Complete' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}>
                        {task.content}
                      </p>
                      {task.priority === 'High' && task.status === 'Pending' && (
                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded dark:bg-red-900 dark:text-red-200">
                          High Priority
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Link
                        href={`/friends/${task.friendId}`}
                        className="hover:underline text-blue-600 dark:text-blue-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {friends[task.friendId]?.name || 'Unknown Friend'}
                      </Link>
                      <span className="mx-2">•</span>
                      <span>
                        {task.status === 'Complete'
                          ? `Completed ${new Date(task.updatedAt).toLocaleDateString()}`
                          : task.status === 'Archived'
                          ? `Archived ${new Date(task.updatedAt).toLocaleDateString()}`
                          : `Created ${new Date(task.createdAt).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {task.status === 'Pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, 'Complete');
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Complete
                      </button>
                    )}
                    {task.status === 'Complete' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, 'Pending');
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Reopen
                      </button>
                    )}
                    {task.status !== 'Archived' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, 'Archived');
                        }}
                        className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
                      >
                        Archive
                      </button>
                    )}
                    {task.status === 'Archived' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, 'Pending');
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Task Modal */}
        <AddTaskForm
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onTaskAdded={handleAddTask}
          friends={Object.values(friends)}
        />

        {/* Task Detail Modal */}
        {selectedTask && (
          <ItemDetailModal
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            item={selectedTask}
            itemType="task"
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            onStatusChange={handleStatusChange}
            friendId={selectedTask.friendId}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}