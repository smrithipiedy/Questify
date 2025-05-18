import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/Dashboard';
import RewardCollection from './components/RewardCollection';
import CharacterShop from './components/CharacterShop';
import './styles/pixelated.css';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" />;
};

function App() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-900 to-gray-900">
        <div className="text-center font-['Press_Start_2P'] text-xs text-white">
          <h1 className="text-lg mb-4">LOADING...</h1>
          <div className="w-64 pixel-progress">
            <div 
              className="pixel-progress-bar animate-pulse"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <div className="min-h-screen bg-gradient-to-b from-purple-900 to-gray-900 text-white">
            <Header />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/rewards" element={
                <PrivateRoute>
                  <RewardCollection />
                </PrivateRoute>
              } />
              <Route path="/shop" element={
                <PrivateRoute>
                  <CharacterShop />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;