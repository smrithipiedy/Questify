import React from 'react';
import TaskList from './TaskList';
import FocusMode from './FocusMode';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.24))] transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <TaskList />
        <FocusMode />
      </div>
    </div>
  );
};

export default Dashboard;