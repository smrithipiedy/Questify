import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Character } from '../types';
import { getRandomTip } from '../utils/characters';
import { playSound } from '../utils/sounds';

interface StudyBuddyProps {
  character: Character;
  isActive: boolean;
}

const StudyBuddy: React.FC<StudyBuddyProps> = ({ character, isActive }) => {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');

  useEffect(() => {
    if (isActive) {
      const tipInterval = setInterval(() => {
        const newTip = getRandomTip(character);
        setCurrentTip(newTip);
        setShowTip(true);
        playSound('BUDDY_TIP');
        
        setTimeout(() => {
          setShowTip(false);
        }, 5000);
      }, 15000); // Show a new tip every 15 seconds

      return () => clearInterval(tipInterval);
    }
  }, [character, isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <img
          src={character.imageUrl}
          alt={character.name}
          className="w-24 h-24 animate-bounce-slow"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {showTip && (
          <div className="absolute bottom-full right-0 mb-4 w-64 bg-gray-800 p-4 pixel-box animate-pixelate">
            <div className="flex items-start">
              <MessageSquare size={16} className="text-blue-400 mr-2 mt-1 flex-shrink-0" />
              <p className="text-white font-['Press_Start_2P'] text-xs">{currentTip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyBuddy;