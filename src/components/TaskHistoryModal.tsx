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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-gray-900 p-6 rounded-lg pixel-border max-w-2xl mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
    >
      <h2 className="text-white font-['Press_Start_2P'] text-lg mb-6">Task History</h2>
      <div className="max-h-[60vh] overflow-y-auto">
        {taskHistory.length === 0 ? (
          <p className="text-gray-400 font-['Press_Start_2P'] text-xs text-center">
            No task history available yet. Complete some tasks to see them here!
          </p>
        ) : (
          taskHistory.map((entry) => (
            <div key={entry.id} className="bg-gray-800 p-4 mb-4 pixel-box">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-['Press_Start_2P'] text-sm mb-2">
                    {entry.details?.title || 'Unknown Task'}
                  </h3>
                  <p className="text-gray-400 font-['Press_Start_2P'] text-xs">
                    {format(new Date(entry.created_at), 'PPpp')}
                  </p>
                  <p className={`text-xs font-['Press_Start_2P'] mt-2 ${
                    entry.action === 'COMPLETED' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {entry.action === 'COMPLETED' ? '✅ Completed' : '❌ Deleted'}
                  </p>
                </div>
                {entry.details?.description && (
                  <p className="text-gray-300 font-['Press_Start_2P'] text-xs max-w-xs">
                    {entry.details.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <button
        onClick={onClose}
        className="mt-6 bg-blue-600 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs"
      >
        Close
      </button>
    </Modal>
  );
};

export default TaskHistoryModal;