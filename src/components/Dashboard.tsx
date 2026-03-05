import React from 'react';
import TaskList from './TaskList';
import FocusMode from './FocusMode';
import PixelFriends from './PixelFriends';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.24))] transition-colors duration-300 relative">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-['Press_Start_2P'] text-yellow-400 dark:text-yellow-300 mb-4 animate-pulse">
          ADVENTURE AWAITS
        </h1>
        <p className="text-lg font-['Press_Start_2P'] text-gray-300 dark:text-gray-400">
          Complete quests • Earn rewards • Level up your life
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <TaskList />
        <FocusMode />
      </div>
      
      {/* Pixel Friends at bottom */}
      <PixelFriends />
    </div>
  );
};

export default Dashboard;