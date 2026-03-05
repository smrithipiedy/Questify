import React from 'react';
import { motion } from 'framer-motion';

const PixelFriends: React.FC = () => {
  const friends = [
    {
      id: 'wizard',
      name: 'Pixel Wizard',
      color: 'from-purple-500 to-indigo-600',
      position: 'left-[10%]',
      delay: 0
    },
    {
      id: 'knight',
      name: 'Brave Knight',
      color: 'from-blue-500 to-cyan-600',
      position: 'left-[25%]',
      delay: 0.5
    },
    {
      id: 'mage',
      name: 'Fire Mage',
      color: 'from-red-500 to-orange-600',
      position: 'left-[40%]',
      delay: 1
    },
    {
      id: 'archer',
      name: 'Swift Archer',
      color: 'from-green-500 to-emerald-600',
      position: 'left-[55%]',
      delay: 1.5
    },
    {
      id: 'rogue',
      name: 'Shadow Rogue',
      color: 'from-gray-600 to-gray-800',
      position: 'left-[70%]',
      delay: 2
    },
    {
      id: 'healer',
      name: 'Divine Healer',
      color: 'from-yellow-400 to-amber-500',
      position: 'left-[85%]',
      delay: 2.5
    }
  ];

  const bounceAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="relative w-full h-48 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 dark:from-green-600 dark:via-blue-700 dark:to-purple-800 pixel-border overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-16 grid-rows-12 h-full w-full">
          {Array.from({ length: 192 }).map((_, i) => (
            <div
              key={i}
              className={`border border-white/10 ${
                Math.random() > 0.8 ? 'bg-white/5' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Clouds */}
      <div className="absolute top-4 left-[20%] w-16 h-8 bg-white/30 rounded-full pixel-corners animate-float"></div>
      <div className="absolute top-6 right-[30%] w-12 h-6 bg-white/20 rounded-full pixel-corners animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-2 left-[60%] w-20 h-10 bg-white/25 rounded-full pixel-corners animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-green-600 to-green-500 dark:from-green-800 dark:to-green-700"></div>

      {/* Pixel Friends */}
      {friends.map((friend) => (
        <motion.div
          key={friend.id}
          className={`absolute bottom-16 ${friend.position} transform -translate-x-1/2`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            ...bounceAnimation,
            transition: {
              ...bounceAnimation.transition,
              delay: friend.delay
            }
          }}
        >
          <div className="relative group cursor-pointer">
            {/* Character Body */}
            <div className={`w-12 h-16 bg-gradient-to-b ${friend.color} pixel-corners shadow-lg hover:scale-110 transition-transform duration-200`}>
              {/* Simple pixel face */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-white pixel-corners"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-white pixel-corners"></div>
              <div className="absolute top-6 left-3 w-6 h-1 bg-white pixel-corners"></div>
              
              {/* Character details based on type */}
              {friend.id === 'wizard' && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-purple-800 pixel-corners"></div>
              )}
              {friend.id === 'knight' && (
                <div className="absolute top-0 left-0 w-full h-4 bg-gray-400 pixel-corners"></div>
              )}
              {friend.id === 'archer' && (
                <div className="absolute -right-2 top-4 w-6 h-1 bg-amber-600 pixel-corners"></div>
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 pixel-corners text-xs font-['Press_Start_2P'] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {friend.name}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Floating particles */}
      <div className="absolute top-8 left-[15%] w-1 h-1 bg-yellow-300 pixel-dot animate-twinkle"></div>
      <div className="absolute top-12 right-[25%] w-1 h-1 bg-cyan-300 pixel-dot animate-twinkle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-6 left-[45%] w-1 h-1 bg-pink-300 pixel-dot animate-twinkle" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-10 right-[15%] w-1 h-1 bg-green-300 pixel-dot animate-twinkle" style={{ animationDelay: '0.5s' }}></div>

      {/* Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <h3 className="font-['Press_Start_2P'] text-white text-sm drop-shadow-lg">
          YOUR PIXEL COMPANIONS
        </h3>
      </div>
    </div>
  );
};

export default PixelFriends;