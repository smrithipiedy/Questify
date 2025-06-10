import React, { useState } from 'react';
import { CheckCircle, Trash2, Clock, Edit, Check, X, AlertTriangle } from 'lucide-react';
import { Task, TaskPriority } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { playSound } from '../utils/sounds';
import Modal from 'react-modal';
import VictoryEffect from './VictoryEffect';

Modal.setAppElement('#root');

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { completeTask, deleteTask, updateTask, startFocusSession } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState<TaskPriority>(task.priority);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmStep, setConfirmStep] = useState(0);
  const [showVictoryEffect, setShowVictoryEffect] = useState(false);
  const [currentReward, setCurrentReward] = useState<any>(null);

  const handleComplete = () => {
    setShowConfirmModal(true);
  };

  const confirmCompletion = () => {
    if (confirmStep === 0) {
      setConfirmStep(1);
      return;
    }
    
    const reward = completeTask(task.id);
    setCurrentReward(reward);
    setShowVictoryEffect(true);
    setShowConfirmModal(false);
    setConfirmStep(0);
  };

  const handleDelete = () => {
    playSound('BUTTON_CLICK');
    deleteTask(task.id);
  };

  const handleStartFocus = () => {
    playSound('BUTTON_CLICK');
    startFocusSession(25, task.id);
  };

  const handleSaveEdit = () => {
    playSound('BUTTON_CLICK');
    updateTask({
      ...task,
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    playSound('BUTTON_CLICK');
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedPriority(task.priority);
    setIsEditing(false);
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case 'low':
        return 'bg-green-500 dark:bg-green-600';
      case 'medium':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'high':
        return 'bg-red-500 dark:bg-red-600';
      default:
        return 'bg-green-500 dark:bg-green-600';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gray-800 dark:bg-gray-700 p-4 mb-4 pixel-box animate-pixelate font-['Press_Start_2P'] text-xs transition-colors duration-300">
        <div className="mb-2">
          <label className="block text-white dark:text-gray-200 mb-1">Title:</label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-100 pixel-corners"
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-white dark:text-gray-200 mb-1">Description:</label>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-100 pixel-corners h-16 resize-none"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-white dark:text-gray-200 mb-1">Priority:</label>
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value as TaskPriority)}
            className="w-full p-2 bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-100 pixel-corners"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancelEdit}
            className="bg-red-500 dark:bg-red-600 text-white px-3 py-1 pixel-btn flex items-center hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
          >
            <X size={14} className="mr-1" />
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 pixel-btn flex items-center hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
          >
            <Check size={14} className="mr-1" />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`bg-gray-800 dark:bg-gray-700 p-4 mb-4 pixel-box animate-pixelate transition-colors duration-300 ${
          task.status === 'completed' ? 'opacity-70' : ''
        }`}
      >
        <div className="flex items-start mb-2">
          <div className={`w-3 h-3 mt-1 mr-2 ${getPriorityColor(task.priority)}`}></div>
          <h3 className={`text-sm font-['Press_Start_2P'] ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-white dark:text-gray-100'}`}>
            {task.title}
          </h3>
        </div>
        
        <p className="text-gray-400 dark:text-gray-500 text-xs ml-5 mb-4 font-['Press_Start_2P']">{task.description}</p>
        
        <div className="flex flex-wrap justify-end gap-2 mt-2">
          {task.status !== 'completed' && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 text-xs pixel-btn flex items-center font-['Press_Start_2P'] hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                <Edit size={12} className="mr-1" /> Edit
              </button>
              
              <button
                onClick={handleStartFocus}
                className="bg-purple-500 dark:bg-purple-600 text-white px-3 py-1 text-xs pixel-btn flex items-center font-['Press_Start_2P'] hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
              >
                <Clock size={12} className="mr-1" /> Focus
              </button>
              
              <button
                onClick={handleComplete}
                className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 text-xs pixel-btn flex items-center font-['Press_Start_2P'] hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={12} className="mr-1" /> Done
              </button>
            </>
          )}
          
          <button
            onClick={handleDelete}
            className="bg-red-500 dark:bg-red-600 text-white px-3 py-1 text-xs pixel-btn flex items-center font-['Press_Start_2P'] hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
          >
            <Trash2 size={12} className="mr-1" /> Delete
          </button>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onRequestClose={() => {
          setShowConfirmModal(false);
          setConfirmStep(0);
        }}
        className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg pixel-border max-w-md mx-auto mt-20 transition-colors duration-300"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      >
        <div className="text-center">
          <AlertTriangle size={48} className="text-yellow-400 dark:text-yellow-300 mx-auto mb-4" />
          <h3 className="text-white dark:text-gray-100 font-['Press_Start_2P'] text-lg mb-4">
            {confirmStep === 0 ? "Are you sure?" : "Double check!"}
          </h3>
          <p className="text-gray-300 dark:text-gray-400 font-['Press_Start_2P'] text-xs mb-6">
            {confirmStep === 0
              ? "Have you completed all requirements for this task?"
              : "Are you being honest with yourself?"}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setShowConfirmModal(false);
                setConfirmStep(0);
              }}
              className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              No
            </button>
            <button
              onClick={confirmCompletion}
              className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>

      {showVictoryEffect && currentReward && (
        <VictoryEffect
          reward={currentReward}
          onClose={() => setShowVictoryEffect(false)}
          source="task"
        />
      )}
    </>
  );
};

export default TaskItem;