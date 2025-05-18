import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/sounds';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMessage('Password reset link sent to your email');
      setError('');
      playSound('BUTTON_CLICK');
    } catch (err) {
      setError('Error sending reset link');
      setMessage('');
      playSound('ERROR');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="bg-gray-900 p-8 rounded-lg pixel-border max-w-md w-full mx-4">
        <h2 className="text-2xl text-white mb-6 font-['Press_Start_2P'] text-center">
          Reset Password
        </h2>
        
        {message && (
          <div className="bg-green-500 text-white p-3 rounded mb-4 font-['Press_Start_2P'] text-xs">
            {message}
          </div>
        )}
        
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
          
          <div className="text-center">
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-['Press_Start_2P'] text-xs"
            >
              Back to Login
            </Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 pixel-btn font-['Press_Start_2P'] text-xs mt-6"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;