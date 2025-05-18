import React from 'react';
import Confetti from 'react-confetti';
import { Reward } from '../types';

interface VictoryEffectProps {
  reward: Reward;
  onClose: () => void;
}

const VictoryEffect: React.FC<VictoryEffectProps> = ({ reward, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
      />
      
      <div className="bg-gray-900 p-8 pixel-box max-w-md w-full mx-4 animate-bounce-slow">
        <h2 className="text-2xl text-center text-white font-['Press_Start_2P'] mb-6">
          VICTORY!
        </h2>
        
        <div className="flex flex-col items-center mb-6">
          <img
            src={reward.imageUrl}
            alt={reward.name}
            className="w-32 h-32 mb-4 animate-pulse"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="text-yellow-400 font-['Press_Start_2P'] text-sm mb-2">
            + {reward.coins} coins
          </p>
          <p className="text-white font-['Press_Start_2P'] text-xs text-center">
            {reward.description}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-green-600 text-white p-3 pixel-btn font-['Press_Start_2P'] text-sm"
        >
          AWESOME!
        </button>
      </div>
    </div>
  );
};

export default VictoryEffect;