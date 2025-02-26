// src/components/friends/detail/tabs/FriendTasksTab.tsx
import React from 'react';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import TaskCard from '../cards/TaskCard';
import AddTaskForm from '../forms/AddTaskForm';

interface FriendTasksTabProps {
  friendId: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function FriendTasksTab({ friendId, tasks, setTasks }: FriendTasksTabProps) {
  const pendingTasks = tasks.filter(task => task.status === 'Pending')
    .sort((a, b) => a.priority === 'High' ? -1 : b.priority === 'High' ? 1 : 0);
  const completedTasks = tasks.filter(task => task.status === 'Complete');
  const archivedTasks = tasks.filter(task => task.status === 'Archived');

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleCompleteTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Complete');
    const completedAt = new Date().toISOString();
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Complete', updatedAt: completedAt, completedAt } : task
    ));
  };

  const handleReopenTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Pending');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Pending', updatedAt: new Date().toISOString() } : task
    ));
  };

  const handleArchiveTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Archived');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Archived', updatedAt: new Date().toISOString() } : task
    ));
  };

  const handleRestoreTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Pending');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Pending', updatedAt: new Date().toISOString() } : task
    ));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Tasks are action items related to your friendship that you need to complete.
      </p>
      
      {/* Add Task Form */}
      <AddTaskForm friendId={friendId} onTaskAdded={handleAddTask} />

      {/* Pending Tasks */}
      <h3 className="font-medium text-lg mb-2">Pending Tasks</h3>
      {pendingTasks.length > 0 ? (
        <div className="space-y-3 mb-6">
          {pendingTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={handleCompleteTask}
              onArchive={handleArchiveTask}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">No pending tasks.</p>
      )}

      {/* Completed Tasks */}
      <h3 className="font-medium text-lg mb-2">Completed Tasks</h3>
      {completedTasks.length > 0 ? (
        <div className="space-y-3 mb-6">
          {completedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onReopen={handleReopenTask}
              onArchive={handleArchiveTask}
              isCompleted
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">No completed tasks.</p>
      )}

      {/* Archived Tasks */}
      <h3 className="font-medium text-lg mb-2">Archived Tasks</h3>
      {archivedTasks.length > 0 ? (
        <div className="space-y-3">
          {archivedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onRestore={handleRestoreTask}
              isArchived
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No archived tasks.</p>
      )}
    </div>
  );
}