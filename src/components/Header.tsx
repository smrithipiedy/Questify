import React, { useState } from 'react';
import { Trophy, Star, Clock, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { playSound } from '../utils/sounds';

const Header: React.FC = () => {
  const { state } = useTaskContext();
  const { stats } = state;
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <header className="bg-blue-500 text-white font-['Press_Start_2P'] text-xs p-4 pixel-border relative">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl screen-flicker">QUESTIFY</Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-600 p-2 pixel-corners">
                <Trophy size={16} className="text-yellow-300" />
                <span>{stats.tasksCompleted} Tasks</span>
              </div>
              
              <div className="flex items-center gap-2 bg-blue-600 p-2 pixel-corners">
                <Star size={16} className="text-yellow-300" />
                <span>{stats.currentStreak} Day Streak</span>
              </div>
              
              <div className="flex items-center gap-2 bg-blue-600 p-2 pixel-corners">
                <Clock size={16} className="text-yellow-300" />
                <span>{Math.round(stats.totalFocusTime)} Mins Focused</span>
              </div>
            </div>

            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-blue-600 pixel-corners transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 w-64 bg-blue-500 mt-1 p-4 pixel-border z-50">
          <nav className="space-y-4">
            <Link
              to="/"
              className="block p-2 hover:bg-blue-600 pixel-corners transition-colors"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/rewards"
              className="block p-2 hover:bg-blue-600 pixel-corners transition-colors"
              onClick={toggleMenu}
            >
              Rewards
            </Link>
            <Link
              to="/shop"
              className="block p-2 hover:bg-blue-600 pixel-corners transition-colors"
              onClick={toggleMenu}
            >
              Study Buddy Shop
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left p-2 hover:bg-blue-600 pixel-corners transition-colors text-red-300"
            >
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;