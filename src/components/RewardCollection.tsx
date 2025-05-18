import React, { useState } from 'react';
import { Trophy, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { Reward } from '../types';
import { getRarityColor, getRarityDisplayText } from '../utils/rewards';
import { playSound } from '../utils/sounds';

const RewardCollection: React.FC = () => {
  const { state } = useTaskContext();
  const { rewards } = state;
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<'task' | 'focus'>('task');
  const rewardsPerPage = 8;
  
  const filteredRewards = rewards.filter(reward => reward.source === activeTab);
  const totalPages = Math.ceil(filteredRewards.length / rewardsPerPage);
  const paginatedRewards = filteredRewards.slice(page * rewardsPerPage, (page + 1) * rewardsPerPage);
  
  const handleRewardClick = (reward: Reward) => {
    playSound('BUTTON_CLICK');
    setSelectedReward(reward);
  };
  
  const handleClose = () => {
    playSound('BUTTON_CLICK');
    setSelectedReward(null);
  };
  
  const handlePreviousPage = () => {
    playSound('BUTTON_CLICK');
    setPage((prevPage) => Math.max(0, prevPage - 1));
  };
  
  const handleNextPage = () => {
    playSound('BUTTON_CLICK');
    setPage((prevPage) => Math.min(totalPages - 1, prevPage + 1));
  };

  const handleTabChange = (tab: 'task' | 'focus') => {
    playSound('BUTTON_CLICK');
    setActiveTab(tab);
    setPage(0);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-gray-900 p-6 rounded-lg pixel-border">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 className="text-lg text-white mb-4 md:mb-0 flex items-center font-['Press_Start_2P']">
            <Trophy size={20} className="mr-2 text-yellow-400" />
            Collection
          </h2>
          
          <div className="flex gap-4">
            <button
              onClick={() => handleTabChange('task')}
              className={`px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs ${
                activeTab === 'task' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              Quest Rewards
            </button>
            <button
              onClick={() => handleTabChange('focus')}
              className={`px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs ${
                activeTab === 'focus' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              Focus Rewards
            </button>
          </div>
          
          {filteredRewards.length > 0 && (
            <div className="flex items-center bg-gray-800 p-2 pixel-corners">
              <button
                onClick={handlePreviousPage}
                disabled={page === 0}
                className={`p-1 ${page === 0 ? 'text-gray-600' : 'text-white'}`}
              >
                <ArrowLeft size={16} />
              </button>
              <span className="mx-2 text-white font-['Press_Start_2P'] text-xs">
                {page + 1} / {totalPages || 1}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages - 1 || totalPages === 0}
                className={`p-1 ${page >= totalPages - 1 || totalPages === 0 ? 'text-gray-600' : 'text-white'}`}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {filteredRewards.length === 0 ? (
          <div className="text-center p-8 text-gray-400 font-['Press_Start_2P'] text-xs">
            {activeTab === 'task' 
              ? 'Complete quests to earn rewards!'
              : 'Complete focus sessions to earn rewards!'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paginatedRewards.map((reward) => (
              <div
                key={reward.id}
                onClick={() => handleRewardClick(reward)}
                className={`${getRarityColor(reward.rarity)} p-3 pixel-box cursor-pointer transition-transform hover:scale-105 animate-pixelate`}
              >
                <div className="flex flex-col items-center">
                  <img 
                    src={reward.imageUrl} 
                    alt={reward.name} 
                    className="w-12 h-12 mb-2 object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <h3 className="text-white text-center text-xs font-['Press_Start_2P']">{reward.name}</h3>
                  <span className="text-gray-200 text-xs font-['Press_Start_2P']">
                    {getRarityDisplayText(reward.rarity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className={`${getRarityColor(selectedReward.rarity)} p-6 max-w-md w-full pixel-box animate-pixelate`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-white text-lg font-['Press_Start_2P']">{selectedReward.name}</h3>
                <button onClick={handleClose} className="text-white hover:text-gray-300">
                  <Info size={20} />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row items-center mb-4">
                <img 
                  src={selectedReward.imageUrl} 
                  alt={selectedReward.name} 
                  className="w-24 h-24 mb-4 md:mb-0 md:mr-4 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div>
                  <p className="text-white mb-2 font-['Press_Start_2P'] text-xs">{selectedReward.description}</p>
                  <div className="flex items-center">
                    <span className="text-gray-200 mr-2 font-['Press_Start_2P'] text-xs">Rarity:</span>
                    <span className="text-white font-bold font-['Press_Start_2P'] text-xs">
                      {getRarityDisplayText(selectedReward.rarity)}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-200 mr-2 font-['Press_Start_2P'] text-xs">Unlocked:</span>
                    <span className="text-white font-['Press_Start_2P'] text-xs">
                      {selectedReward.unlockedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleClose}
                className="w-full bg-blue-600 text-white p-2 mt-4 pixel-btn font-['Press_Start_2P'] text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardCollection;