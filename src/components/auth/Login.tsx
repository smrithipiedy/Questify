import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/sounds';

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

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="bg-gray-900 p-8 rounded-lg pixel-border max-w-md w-full mx-4">
        <h2 className="text-2xl text-white mb-6 font-['Press_Start_2P'] text-center">Login</h2>
        
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
          
          <div className="flex justify-between items-center">
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:text-blue-300 font-['Press_Start_2P'] text-xs"
            >
              Forgot Password?
            </Link>
            
            <Link
              to="/signup"
              className="text-green-400 hover:text-green-300 font-['Press_Start_2P'] text-xs"
            >
              Sign Up
            </Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 pixel-btn font-['Press_Start_2P'] text-xs mt-6"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;