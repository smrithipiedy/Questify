import React from 'react';
import TaskList from './TaskList';
import FocusMode from './FocusMode';

const Dashboard: React.FC = () => {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskList />
        <FocusMode />
      </div>
    </main>
  );
};

export default Dashboard;