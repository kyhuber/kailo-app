// src/app/tasks/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TaskStorage, Task } from '@/utils/tasks_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import ConfirmModal from '@/components/shared/ConfirmModal';
import TaskModal from '@/components/tasks/TaskModal';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [friends, setFriends] = useState<Record<string, Friend>>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'archived'>('pending');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null);
  const [taskToReopen, setTaskToReopen] = useState<string | null>(null);
  const [taskToArchive, setTaskToArchive] = useState<string | null>(null);
  const [taskToRestore, setTaskToRestore] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Load all tasks
        const allTasks = await TaskStorage.getTasksByFriend('all') as Task[];
        if (Array.isArray(allTasks)) {
          setTasks(allTasks);
        }
        
        // Load all friends for reference
        const allFriends = await FriendStorage.getFriends() as Friend[];
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
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: "Pending" | "Complete" | "Archived") => {
    await TaskStorage.updateTaskStatus(taskId, newStatus);
    
    if (newStatus === 'Complete') {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString(), completedAt: new Date().toISOString() } 
          : task
      ));
    } else {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } 
          : task
      ));
    }
    
    // Reset modal states
    setTaskToComplete(null);
    setTaskToReopen(null);
    setTaskToArchive(null);
    setTaskToRestore(null);
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => task.status === 'Pending');
      case 'completed':
        return tasks.filter(task => task.status === 'Complete');
      case 'archived':
        return tasks.filter(task => task.status === 'Archived');
      default:
        return tasks;
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
        <button 
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add Task
        </button>
      </div>
      
      {/* Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 rounded-md ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            All Tasks
          </button>
          <button 
            onClick={() => setFilter('pending')} 
            className={`px-4 py-2 rounded-md ${
              filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            className={`px-4 py-2 rounded-md ${
              filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter('archived')} 
            className={`px-4 py-2 rounded-md ${
              filter === 'archived' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Archived
          </button>
        </div>
      </div>
      
      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No {filter} tasks found.
          </p>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add a New Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks
            .sort((a, b) => {
              // Sort by priority first
              if (a.priority === 'High' && b.priority !== 'High') return -1;
              if (a.priority !== 'High' && b.priority === 'High') return 1;
              
              // Then by creation date (newest first)
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map(task => (
              <div 
                key={task.id} 
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${
                  task.priority === 'High' ? 'border-l-4 border-red-500' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <p className={task.status === 'Complete' ? 'line-through' : ''}>
                        {task.content}
                      </p>
                      {task.priority === 'High' && (
                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                          High Priority
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Link 
                        href={`/friends/${task.friendId}`}
                        className="hover:underline text-blue-600 dark:text-blue-400"
                      >
                        {friends[task.friendId]?.name || 'Unknown Friend'}
                      </Link>
                      <span className="mx-2">•</span>
                      <span>
                        {task.status === 'Complete' 
                          ? `Completed on ${new Date(task.updatedAt).toLocaleDateString()}`
                          : `Created on ${new Date(task.createdAt).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {task.status === 'Pending' && (
                      <button 
                        onClick={() => setTaskToComplete(task.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Complete
                      </button>
                    )}
                    
                    {task.status === 'Complete' && (
                      <button 
                        onClick={() => setTaskToReopen(task.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Reopen
                      </button>
                    )}
                    
                    {task.status !== 'Archived' ? (
                      <button 
                        onClick={() => setTaskToArchive(task.id)}
                        className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
                      >
                        Archive
                      </button>
                    ) : (
                      <button 
                        onClick={() => setTaskToRestore(task.id)}
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
      
      {/* Modals */}
      <TaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskAdded={handleAddTask}
        friends={Object.values(friends)}
      />
      
      <ConfirmModal
        isOpen={!!taskToComplete}
        onClose={() => setTaskToComplete(null)}
        onConfirm={() => taskToComplete && handleUpdateTaskStatus(taskToComplete, 'Complete')}
        title="Complete Task"
        message="Mark this task as complete?"
        confirmButtonText="Complete"
        variant="info"
      />
      
      <ConfirmModal
        isOpen={!!taskToReopen}
        onClose={() => setTaskToReopen(null)}
        onConfirm={() => taskToReopen && handleUpdateTaskStatus(taskToReopen, 'Pending')}
        title="Reopen Task"
        message="Do you want to reopen this task and mark it as pending?"
        confirmButtonText="Reopen"
        variant="warning"
      />
      
      <ConfirmModal
        isOpen={!!taskToArchive}
        onClose={() => setTaskToArchive(null)}
        onConfirm={() => taskToArchive && handleUpdateTaskStatus(taskToArchive, 'Archived')}
        title="Archive Task"
        message="Are you sure you want to archive this task? You can restore it later if needed."
        confirmButtonText="Archive"
        variant="warning"
      />
      
      <ConfirmModal
        isOpen={!!taskToRestore}
        onClose={() => setTaskToRestore(null)}
        onConfirm={() => taskToRestore && handleUpdateTaskStatus(taskToRestore, 'Pending')}
        title="Restore Task"
        message="Do you want to restore this task to pending status?"
        confirmButtonText="Restore"
        variant="info"
      />
    </div>
  );
}