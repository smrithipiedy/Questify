import React, { useState } from 'react';
import { Trophy, Star, Clock, Menu, X, Coins } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { playSound } from '../utils/sounds';
import TaskHistoryModal from './TaskHistoryModal';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { state } = useTaskContext();
  const { stats } = state;
  const { signOut, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTaskHistory, setShowTaskHistory] = useState(false);

  const isAuthPage = location.pathname === '/login' || 
                    location.pathname === '/signup' || 
                    location.pathname === '/forgot-password' ||
                    location.pathname === '/reset-password';

  const handleSignOut = async () => {
    try {
      await signOut();
      playSound('BUTTON_CLICK');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    playSound('BUTTON_CLICK');
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-500 dark:bg-blue-600 text-white font-['Press_Start_2P'] text-xs p-4 pixel-border relative transition-colors duration-300">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-blue-600 dark:hover:bg-blue-700 pixel-corners transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="text-xl screen-flicker">QUESTIFY</Link>
          </div>
          
          <div className="flex items-center gap-4">
            {session && !isAuthPage && (
              <>
                <div className="flex items-center gap-2 bg-yellow-600 dark:bg-yellow-500 p-2 pixel-corners">
                  <Coins size={16} className="text-yellow-300 dark:text-yellow-200" />
                  <span>{stats?.coins ?? 0}</span>
                </div>
                
                <button 
                  onClick={() => setShowTaskHistory(true)}
                  className="hidden md:flex items-center gap-2 bg-blue-600 dark:bg-blue-700 p-2 pixel-corners cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  <Trophy size={16} className="text-yellow-300 dark:text-yellow-200" />
                  <span>{stats.tasksCompleted} Tasks</span>
                </button>
                
                <div className="hidden md:flex items-center gap-2 bg-blue-600 dark:bg-blue-700 p-2 pixel-corners">
                  <Star size={16} className="text-yellow-300 dark:text-yellow-200" />
                  <span>{stats.currentStreak} Day Streak</span>
                </div>
                
                <div className="hidden md:flex items-center gap-2 bg-blue-600 dark:bg-blue-700 p-2 pixel-corners">
                  <Clock size={16} className="text-yellow-300 dark:text-yellow-200" />
                  <span>{Math.round(stats.totalFocusTime)} Mins Focused</span>
                </div>
              </>
            )}
            
            <ThemeToggle />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-64 bg-blue-500 dark:bg-blue-600 mt-1 p-4 pixel-border z-50 transition-colors duration-300">
          <nav className="space-y-4">
            {session ? (
              <>
                <Link
                  to="/"
                  className="block p-2 hover:bg-blue-600 dark:hover:bg-blue-700 pixel-corners transition-colors"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/rewards"
                  className="block p-2 hover:bg-blue-600 dark:hover:bg-blue-700 pixel-corners transition-colors"
                  onClick={toggleMenu}
                >
                  Rewards
                </Link>
                <Link
                  to="/shop"
                  className="block p-2 hover:bg-blue-600 dark:hover:bg-blue-700 pixel-corners transition-colors"
                  onClick={toggleMenu}
                >
                  Study Buddy Shop
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                  className="w-full text-left p-2 hover:bg-blue-600 dark:hover:bg-blue-700 pixel-corners transition-colors text-red-300 dark:text-red-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block p-2 hover:bg-blue-600 dark:hover:bg-blue-700 pixel-corners transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block p-2 hover:bg-blue-600 dark:hover:bg-blue-700 pixel-corners transition-colors"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      <TaskHistoryModal
        isOpen={showTaskHistory}
        onClose={() => setShowTaskHistory(false)}
      />
    </header>
  );
};

export default Header;