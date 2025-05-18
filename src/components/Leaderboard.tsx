import React from 'react';
import { Trophy, Crown, Clock, Star } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

const Leaderboard: React.FC = () => {
  const { state } = useTaskContext();
  const { leaderboard } = state;

  return (
    <div className="bg-gray-900 p-6 rounded-lg pixel-border mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white flex items-center font-['Press_Start_2P']">
          <Trophy size={20} className="mr-2 text-yellow-400" />
          Leaderboard
        </h2>
        <div className="flex items-center gap-2">
          <select className="bg-gray-800 text-white p-2 pixel-corners font-['Press_Start_2P'] text-xs">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {leaderboard?.map((entry, index) => (
          <div
            key={entry.id}
            className={`bg-gray-800 p-4 pixel-box flex items-center justify-between ${
              index === 0 ? 'border-yellow-400' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="w-8 text-center font-['Press_Start_2P'] text-xs">
                {index === 0 && <Crown className="text-yellow-400 w-4 h-4" />}
                {index > 0 && `#${index + 1}`}
              </span>
              <span className="text-white font-['Press_Start_2P'] text-xs ml-4">
                {entry.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Clock size={14} className="text-blue-400 mr-1" />
                <span className="text-white font-['Press_Start_2P'] text-xs">
                  {Math.round(entry.focusTime)}m
                </span>
              </div>
              <div className="flex items-center">
                <Star size={14} className="text-yellow-400 mr-1" />
                <span className="text-white font-['Press_Start_2P'] text-xs">
                  {entry.score}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;