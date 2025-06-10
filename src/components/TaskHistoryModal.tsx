import React from 'react';
import Modal from 'react-modal';
import { useTaskContext } from '../context/TaskContext';
import { format } from 'date-fns';

interface TaskHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskHistoryModal: React.FC<TaskHistoryModalProps> = ({ isOpen, onClose }) => {
  const { state } = useTaskContext();
  const { taskHistory } = state;

  // Sort task history by date (newest first)
  const sortedHistory = [...taskHistory].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg pixel-border max-w-2xl mx-auto mt-20 transition-colors duration-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
    >
      <h2 className="text-white dark:text-gray-100 font-['Press_Start_2P'] text-lg mb-6">Task History</h2>
      <div className="max-h-[60vh] overflow-y-auto">
        {sortedHistory.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 font-['Press_Start_2P'] text-xs text-center">
            No task history available yet. Complete some tasks to see them here!
          </p>
        ) : (
          sortedHistory.map((entry) => (
            <div key={entry.id} className="bg-gray-800 dark:bg-gray-700 p-4 mb-4 pixel-box transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-white dark:text-gray-100 font-['Press_Start_2P'] text-sm mb-2">
                    {entry.details?.title || 'Unknown Task'}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 font-['Press_Start_2P'] text-xs">
                    {format(new Date(entry.created_at), 'PPpp')}
                  </p>
                  <p className={`text-xs font-['Press_Start_2P'] mt-2 ${
                    entry.action === 'COMPLETED' ? 'text-green-400 dark:text-green-300' : 
                    entry.action === 'DELETED' ? 'text-red-400 dark:text-red-300' :
                    'text-blue-400 dark:text-blue-300'
                  }`}>
                    {entry.action === 'COMPLETED' ? '✅ Completed' : 
                     entry.action === 'DELETED' ? '❌ Deleted' :
                     '📝 Created'}
                  </p>
                  {entry.action === 'COMPLETED' && entry.details?.reward && (
                    <p className="text-yellow-400 dark:text-yellow-300 font-['Press_Start_2P'] text-xs mt-1">
                      🏆 Earned: {entry.details.reward.name} (+{entry.details.reward.coins} coins)
                    </p>
                  )}
                </div>
                {entry.details?.description && (
                  <div className="ml-4 max-w-xs">
                    <p className="text-gray-300 dark:text-gray-400 font-['Press_Start_2P'] text-xs">
                      {entry.details.description}
                    </p>
                    {entry.details.priority && (
                      <span className={`inline-block mt-2 px-2 py-1 text-xs font-['Press_Start_2P'] rounded ${
                        entry.details.priority === 'high' ? 'bg-red-500 dark:bg-red-600' :
                        entry.details.priority === 'medium' ? 'bg-yellow-500 dark:bg-yellow-600' :
                        'bg-green-500 dark:bg-green-600'
                      }`}>
                        {entry.details.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <button
        onClick={onClose}
        className="mt-6 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
      >
        Close
      </button>
    </Modal>
  );
};

export default TaskHistoryModal;