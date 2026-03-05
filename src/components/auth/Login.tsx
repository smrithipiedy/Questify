import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/sounds';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      playSound('BUTTON_CLICK');
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
      playSound('ERROR');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 pixel-dot animate-twinkle"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-cyan-400 pixel-dot animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-pink-400 pixel-dot animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-3 h-3 bg-green-400 pixel-dot animate-twinkle" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="absolute top-[5%] w-full text-center z-10"
      >
        <div className="inline-block">
          {Array.from("QUESTIFY LOGIN").map((char, index) => (
            <motion.span
              key={index}
              variants={item}
              className="inline-block text-3xl md:text-5xl text-yellow-400 font-['Press_Start_2P'] retro-text-glow"
              style={{
                animation: `wave 1.5s ease-in-out ${index * 0.1}s infinite`
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <div className="bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 pixel-box max-w-md w-full mx-4 z-20">
        <h2 className="text-2xl text-white dark:text-gray-100 mb-6 font-['Press_Start_2P'] text-center">ENTER GAME</h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 pixel-corners mb-4 font-['Press_Start_2P'] text-xs animate-pulse">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white dark:text-gray-200 mb-2 font-['Press_Start_2P'] text-xs">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 pixel-corners font-['Press_Start_2P'] text-xs border-2 border-gray-600 focus:border-blue-400 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-white dark:text-gray-200 mb-2 font-['Press_Start_2P'] text-xs">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 pixel-corners font-['Press_Start_2P'] text-xs border-2 border-gray-600 focus:border-blue-400 transition-colors"
              required
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:text-blue-300 font-['Press_Start_2P'] text-xs hover:retro-glow transition-all"
            >
              Forgot Password?
            </Link>
            
            <Link
              to="/signup"
              className="text-green-400 hover:text-green-300 font-['Press_Start_2P'] text-xs hover:retro-glow transition-all"
            >
              Sign Up
            </Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-4 pixel-btn font-['Press_Start_2P'] text-sm mt-6 transition-all duration-200 hover:scale-105"
          >
            START GAME
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;