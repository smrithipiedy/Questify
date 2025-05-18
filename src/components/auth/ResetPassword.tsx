import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/sounds';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      playSound('ERROR');
      return;
    }

    try {
      await updatePassword(newPassword);
      playSound('BUTTON_CLICK');
      navigate('/login');
    } catch (err) {
      setError('Error updating password');
      playSound('ERROR');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="bg-gray-900 p-8 rounded-lg pixel-border max-w-md w-full mx-4">
        <h2 className="text-2xl text-white mb-6 font-['Press_Start_2P'] text-center">
          Set New Password
        </h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 font-['Press_Start_2P'] text-xs">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-['Press_Start_2P'] text-xs">
              New Password:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white pixel-corners font-['Press_Start_2P'] text-xs"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-2 font-['Press_Start_2P'] text-xs">
              Confirm New Password:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white pixel-corners font-['Press_Start_2P'] text-xs"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 pixel-btn font-['Press_Start_2P'] text-xs mt-6"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;