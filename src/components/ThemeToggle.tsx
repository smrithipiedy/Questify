import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { playSound } from '../utils/sounds';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    playSound('BUTTON_CLICK');
    setTheme(newTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={16} />;
      case 'dark':
        return <Moon size={16} />;
      case 'system':
        return <Monitor size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  return (
    <div className="relative group">
      <button
        className="p-2 hover:bg-blue-600 dark:hover:bg-blue-400 pixel-corners transition-colors"
        title="Toggle theme"
      >
        {getIcon()}
      </button>
      
      <div className="absolute top-full right-0 mt-1 bg-blue-500 dark:bg-blue-600 pixel-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2 space-y-1 min-w-[120px]">
          <button
            onClick={() => handleThemeChange('light')}
            className={`w-full text-left p-2 pixel-corners transition-colors font-['Press_Start_2P'] text-xs flex items-center ${
              theme === 'light' ? 'bg-blue-600 dark:bg-blue-700' : 'hover:bg-blue-600 dark:hover:bg-blue-400'
            }`}
          >
            <Sun size={14} className="mr-2" />
            Light
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`w-full text-left p-2 pixel-corners transition-colors font-['Press_Start_2P'] text-xs flex items-center ${
              theme === 'dark' ? 'bg-blue-600 dark:bg-blue-700' : 'hover:bg-blue-600 dark:hover:bg-blue-400'
            }`}
          >
            <Moon size={14} className="mr-2" />
            Dark
          </button>
          <button
            onClick={() => handleThemeChange('system')}
            className={`w-full text-left p-2 pixel-corners transition-colors font-['Press_Start_2P'] text-xs flex items-center ${
              theme === 'system' ? 'bg-blue-600 dark:bg-blue-700' : 'hover:bg-blue-600 dark:hover:bg-blue-400'
            }`}
          >
            <Monitor size={14} className="mr-2" />
            System
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;