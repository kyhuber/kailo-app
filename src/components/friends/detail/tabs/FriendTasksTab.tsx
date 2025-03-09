// src/components/friends/detail/tabs/FriendTasksTab.tsx
import React, { useState } from 'react';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import { ItemStatus } from '@/types/shared';
import TopicCard from '../cards/TopicCard';
import AddTaskForm from '../forms/AddTaskForm';
import ConfirmModal from '@/components/shared/ConfirmModal';
import ItemDetailModal, { GenericItem } from '@/components/shared/ItemDetailModal';

interface FriendTasksTabProps {
  friendId: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function FriendTasksTab({ friendId, tasks, setTasks }: FriendTasksTabProps) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null);
  const [taskToReopen, setTaskToReopen] = useState<string | null>(null);
  const [taskToArchive, setTaskToArchive] = useState<string | null>(null);
  const [taskToRestore, setTaskToRestore] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'pending' | 'completed' | 'archived'>('pending');
  
  const pendingTasks = tasks.filter(task => task.status === 'Pending')
    .sort((a, b) => a.priority === 'High' ? -1 : b.priority === 'High' ? 1 : 0);
  const completedTasks = tasks.filter(task => task.status === 'Complete');
  const archivedTasks = tasks.filter(task => task.status === 'Archived');

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskUpdated = (updatedTask: GenericItem) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask as Task : task));
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    await TaskStorage.deleteItem(taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleCompleteTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Complete');
    const completedAt = new Date().toISOString();
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Complete', updatedAt: completedAt, completedAt } : task
    ));
    setTaskToComplete(null);
  };

  const handleReopenTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Pending');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Pending', updatedAt: new Date().toISOString() } : task
    ));
    setTaskToReopen(null);
  };

  const handleArchiveTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Archived');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Archived', updatedAt: new Date().toISOString() } : task
    ));
    setTaskToArchive(null);
  };

  const handleRestoreTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Pending');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Pending', updatedAt: new Date().toISOString() } : task
    ));
    setTaskToRestore(null);
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    await TaskStorage.updateTaskStatus(taskId, status as ItemStatus);
    const updatedAt = new Date().toISOString();
    const updatedTask: Partial<Task> = { status: status as ItemStatus, updatedAt };
    
    if (status === 'Complete') {
      updatedTask.completedAt = updatedAt;
    }
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
    setSelectedTask(null);
  };

  const filteredTasks = filter === 'pending' 
    ? pendingTasks 
    : filter === 'completed' 
    ? completedTasks 
    : archivedTasks;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button 
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          + Add Task
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Tasks are action items related to your friendship that you need to complete.
      </p>
      
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Pending ({pendingTasks.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Completed ({completedTasks.length})
        </button>
        <button
          onClick={() => setFilter('archived')}
          className={`px-4 py-2 rounded-md ${filter === 'archived' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Archived ({archivedTasks.length})
        </button>
      </div>
      
      {filteredTasks.length > 0 ? (
        <div className="space-y-3 mb-6">
          {filteredTasks.map(task => (
            <TopicCard 
              key={task.id} 
              item={task}
              onComplete={filter === 'pending' ? setTaskToComplete : undefined}
              onReopen={filter === 'completed' ? setTaskToReopen : undefined}
              onArchive={filter !== 'archived' ? setTaskToArchive : undefined}
              onRestore={filter === 'archived' ? setTaskToRestore : undefined}
              isCompleted={filter === 'completed'}
              isArchived={filter === 'archived'}
              onClick={() => setSelectedTask(task)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          {filter === 'pending' 
            ? "No pending tasks. Great job!" 
            : filter === 'completed'
            ? "No completed tasks yet." 
            : "No archived tasks."}
        </p>
      )}
      
      {/* Task Detail Modal */}
      <ItemDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        item={selectedTask}
        itemType="task"
        onDelete={handleDeleteTask}
        onUpdate={handleTaskUpdated}
        onStatusChange={handleStatusChange}
        friendId={friendId}
      />
      
      {/* Modals */}
      <AddTaskForm 
        friendId={friendId} 
        onTaskAdded={handleAddTask} 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
      
      <ConfirmModal
        isOpen={!!taskToComplete}
        onClose={() => setTaskToComplete(null)}
        onConfirm={() => taskToComplete && handleCompleteTask(taskToComplete)}
        title="Complete Task"
        message="Mark this task as complete?"
        confirmButtonText="Complete"
        variant="info"
      />
      
      <ConfirmModal
        isOpen={!!taskToReopen}
        onClose={() => setTaskToReopen(null)}
        onConfirm={() => taskToReopen && handleReopenTask(taskToReopen)}
        title="Reopen Task"
        message="Do you want to reopen this task and mark it as pending?"
        confirmButtonText="Reopen"
        variant="warning"
      />
      
      <ConfirmModal
        isOpen={!!taskToArchive}
        onClose={() => setTaskToArchive(null)}
        onConfirm={() => taskToArchive && handleArchiveTask(taskToArchive)}
        title="Archive Task"
        message="Are you sure you want to archive this task? You can restore it later if needed."
        confirmButtonText="Archive"
        variant="warning"
      />
      
      <ConfirmModal
        isOpen={!!taskToRestore}
        onClose={() => setTaskToRestore(null)}
        onConfirm={() => taskToRestore && handleRestoreTask(taskToRestore)}
        title="Restore Task"
        message="Do you want to restore this task to pending status?"
        confirmButtonText="Restore"
        variant="info"
      />
    </div>
  );
}