import React, { useState } from 'react';
import { PlusSquare, Filter } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { Task, TaskPriority, TaskStatus } from '../types';
import { playSound } from '../utils/sounds';

const TaskList: React.FC = () => {
  const { state, addTask } = useTaskContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      playSound('ERROR');
      return;
    }
    
    playSound('BUTTON_CLICK');
    
    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'pending',
      priority: newTaskPriority,
    });
    
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setShowForm(false);
  };

  const filteredTasks = state.tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by status (pending first, then in-progress, then completed)
    if (a.status !== b.status) {
      if (a.status === 'completed') return 1;
      if (b.status === 'completed') return -1;
      if (a.status === 'in-progress') return -1;
      if (b.status === 'in-progress') return 1;
    }
    
    // Then sort by priority (high, medium, low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Finally sort by creation date (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const toggleForm = () => {
    playSound('BUTTON_CLICK');
    setShowForm(!showForm);
  };

  return (
    <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg pixel-border transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-lg text-white dark:text-gray-100 mb-4 md:mb-0 font-['Press_Start_2P']">Your Quests</h2>
        
        <div className="flex gap-3 flex-wrap justify-center">
          <div className="flex items-center bg-gray-800 dark:bg-gray-700 p-2 rounded pixel-corners">
            <Filter size={16} className="text-white dark:text-gray-200 mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as TaskStatus | 'all')}
              className="bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200 font-['Press_Start_2P'] text-xs border-none focus:outline-none"
            >
              <option value="all">All Quests</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <button
            onClick={toggleForm}
            className="bg-green-500 dark:bg-green-600 text-white p-2 pixel-btn font-['Press_Start_2P'] text-xs flex items-center hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
          >
            <PlusSquare size={16} className="mr-2" />
            New Quest
          </button>
        </div>
      </div>
      
      {showForm && (
        <form
          onSubmit={handleAddTask}
          className="bg-gray-800 dark:bg-gray-700 p-4 mb-6 pixel-box animate-pixelate transition-colors duration-300"
        >
          <div className="mb-3">
            <label htmlFor="title" className="block text-white dark:text-gray-200 mb-1 font-['Press_Start_2P'] text-xs">
              Title:
            </label>
            <input
              id="title"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full p-2 bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-100 font-['Press_Start_2P'] text-xs pixel-corners"
              placeholder="Enter quest title"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="block text-white dark:text-gray-200 mb-1 font-['Press_Start_2P'] text-xs">
              Description:
            </label>
            <textarea
              id="description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-100 font-['Press_Start_2P'] text-xs pixel-corners h-20 resize-none"
              placeholder="Describe your quest"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="priority" className="block text-white dark:text-gray-200 mb-1 font-['Press_Start_2P'] text-xs">
              Priority:
            </label>
            <select
              id="priority"
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
              className="w-full p-2 bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-100 font-['Press_Start_2P'] text-xs pixel-corners"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 font-['Press_Start_2P'] text-xs pixel-btn hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 font-['Press_Start_2P'] text-xs pixel-btn hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
            >
              Add Quest
            </button>
          </div>
        </form>
      )}
      
      {sortedTasks.length === 0 ? (
        <div className="text-center p-8 text-gray-400 dark:text-gray-500 font-['Press_Start_2P'] text-xs">
          No quests available. Create a new quest to begin your adventure!
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task: Task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;