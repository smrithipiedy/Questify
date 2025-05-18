import React, { useState } from 'react';
import { ShoppingBag, Coins, Lock, Check } from 'lucide-react';
import { Character } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { playSound } from '../utils/sounds';

const CharacterShop: React.FC = () => {
  const { state, unlockCharacter } = useTaskContext();
  const { characters = [], stats } = state;
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handlePurchase = (character: Character) => {
    if (stats.coins >= character.cost && !character.unlocked) {
      playSound('PURCHASE');
      unlockCharacter(character.id, character.cost);
      playSound('CHARACTER_UNLOCK');
    } else {
      playSound('ERROR');
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg pixel-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white flex items-center font-['Press_Start_2P']">
          <ShoppingBag size={20} className="mr-2 text-yellow-400" />
          Study Buddy Shop
        </h2>
        <div className="flex items-center bg-yellow-600 px-3 py-2 pixel-corners">
          <Coins size={16} className="text-yellow-300 mr-2" />
          <span className="text-white font-['Press_Start_2P'] text-xs">
            {stats?.coins ?? 0} coins
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characters.map((character) => (
          <div
            key={character.id}
            className={`bg-gray-800 p-4 pixel-box ${
              character.unlocked ? 'border-green-500' : ''
            }`}
          >
            <div className="flex items-center mb-3">
              <img
                src={character.imageUrl}
                alt={character.name}
                className="w-16 h-16 mr-4"
                style={{ imageRendering: 'pixelated' }}
              />
              <div>
                <h3 className="text-white font-['Press_Start_2P'] text-sm mb-1">
                  {character.name}
                </h3>
                <p className="text-gray-400 font-['Press_Start_2P'] text-xs">
                  {character.personality}
                </p>
              </div>
            </div>
            
            <p className="text-gray-300 font-['Press_Start_2P'] text-xs mb-4">
              {character.description}
            </p>

            {character.unlocked ? (
              <button
                className="w-full bg-green-600 text-white p-2 pixel-btn font-['Press_Start_2P'] text-xs flex items-center justify-center"
                disabled
              >
                <Check size={16} className="mr-2" />
                Unlocked
              </button>
            ) : (
              <button
                onClick={() => handlePurchase(character)}
                disabled={stats?.coins < character.cost}
                className={`w-full p-2 pixel-btn font-['Press_Start_2P'] text-xs flex items-center justify-center ${
                  stats?.coins >= character.cost
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                <Lock size={16} className="mr-2" />
                {character.cost} coins
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterShop;