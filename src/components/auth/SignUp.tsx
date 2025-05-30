import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/sounds';
import { motion } from 'framer-motion';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      playSound('ERROR');
      return;
    }

    try {
      await signUp(email, password);
      playSound('BUTTON_CLICK');
      navigate('/login');
    } catch (err) {
      setError('Error creating account');
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="absolute top-[10%] w-full text-center z-10"
      >
        <div className="inline-block">
          {Array.from("Welcome to Questify!").map((char, index) => (
            <motion.span
              key={index}
              variants={item}
              className="inline-block text-4xl md:text-6xl text-white font-['Press_Start_2P'] welcome-text"
              style={{
                animation: `wave 1.5s ease-in-out ${index * 0.1}s infinite`
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <div className="bg-gray-900 p-8 rounded-lg pixel-border max-w-md w-full mx-4 z-20">
        <h2 className="text-2xl text-white mb-6 font-['Press_Start_2P'] text-center">Sign Up</h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 font-['Press_Start_2P'] text-xs">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-['Press_Start_2P'] text-xs">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white pixel-corners font-['Press_Start_2P'] text-xs"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-2 font-['Press_Start_2P'] text-xs">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white pixel-corners font-['Press_Start_2P'] text-xs"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-2 font-['Press_Start_2P'] text-xs">
              Confirm Password:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white pixel-corners font-['Press_Start_2P'] text-xs"
              required
            />
          </div>
          
          <div className="text-center">
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-['Press_Start_2P'] text-xs"
            >
              Already have an account? Login
            </Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 pixel-btn font-['Press_Start_2P'] text-xs mt-6"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;