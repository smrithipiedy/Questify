import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Clock, Star, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
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

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 pixel-dot animate-twinkle"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-cyan-400 pixel-dot animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-pink-400 pixel-dot animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-3 h-3 bg-green-400 pixel-dot animate-twinkle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-60 left-1/2 w-4 h-4 bg-orange-400 pixel-dot animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-2">
            <Gamepad2 size={32} className="text-yellow-400" />
            <span className="text-2xl font-['Press_Start_2P'] text-yellow-400">QUESTIFY</span>
          </div>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 pixel-btn font-['Press_Start_2P'] text-xs transition-all duration-200 hover:scale-105"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 pixel-btn font-['Press_Start_2P'] text-xs transition-all duration-200 hover:scale-105"
            >
              SIGN UP
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-6xl mx-auto px-6 py-12"
      >
        <div className="text-center mb-16">
          <motion.div variants={item} className="mb-8">
            <h1 className="text-6xl md:text-8xl font-['Press_Start_2P'] text-yellow-400 mb-4 leading-tight">
              QUESTIFY
            </h1>
            <div className="text-xl md:text-2xl font-['Press_Start_2P'] text-cyan-300 mb-6">
              LEVEL UP YOUR PRODUCTIVITY
            </div>
          </motion.div>

          <motion.p
            variants={item}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-['Press_Start_2P'] leading-relaxed"
          >
            Transform your daily tasks into epic quests! Earn rewards, unlock achievements, 
            and boost your focus with our gamified productivity system.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 pixel-btn font-['Press_Start_2P'] text-sm transition-all duration-200 hover:scale-105 shadow-lg"
            >
              START YOUR QUEST
            </Link>
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 pixel-btn font-['Press_Start_2P'] text-sm transition-all duration-200 hover:scale-105 shadow-lg"
            >
              CONTINUE ADVENTURE
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div variants={item} className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            animate={floatingAnimation}
            className="bg-gray-800/50 backdrop-blur-sm p-6 pixel-box text-center hover:bg-gray-700/50 transition-all duration-300"
          >
            <Trophy size={48} className="text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-['Press_Start_2P'] text-yellow-400 mb-3">EPIC REWARDS</h3>
            <p className="text-gray-300 font-['Press_Start_2P'] text-xs leading-relaxed">
              Unlock rare treasures and collectibles as you complete your daily quests
            </p>
          </motion.div>

          <motion.div
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 pixel-box text-center hover:bg-gray-700/50 transition-all duration-300"
          >
            <Clock size={48} className="text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-['Press_Start_2P'] text-cyan-400 mb-3">FOCUS TIMER</h3>
            <p className="text-gray-300 font-['Press_Start_2P'] text-xs leading-relaxed">
              Master the art of concentration with Pomodoro-style focus sessions
            </p>
          </motion.div>

          <motion.div
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 pixel-box text-center hover:bg-gray-700/50 transition-all duration-300"
          >
            <Users size={48} className="text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-['Press_Start_2P'] text-pink-400 mb-3">STUDY BUDDIES</h3>
            <p className="text-gray-300 font-['Press_Start_2P'] text-xs leading-relaxed">
              Unlock pixel companions to guide and motivate you on your journey
            </p>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={item} className="bg-gray-800/30 backdrop-blur-sm p-8 pixel-box mb-16">
          <h2 className="text-3xl font-['Press_Start_2P'] text-center text-white mb-8">GAME STATS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-['Press_Start_2P'] text-yellow-400 mb-2">1000+</div>
              <div className="text-sm font-['Press_Start_2P'] text-gray-300">QUESTS COMPLETED</div>
            </div>
            <div>
              <div className="text-3xl font-['Press_Start_2P'] text-green-400 mb-2">500+</div>
              <div className="text-sm font-['Press_Start_2P'] text-gray-300">REWARDS EARNED</div>
            </div>
            <div>
              <div className="text-3xl font-['Press_Start_2P'] text-blue-400 mb-2">2500+</div>
              <div className="text-sm font-['Press_Start_2P'] text-gray-300">FOCUS HOURS</div>
            </div>
            <div>
              <div className="text-3xl font-['Press_Start_2P'] text-pink-400 mb-2">100+</div>
              <div className="text-sm font-['Press_Start_2P'] text-gray-300">ACTIVE PLAYERS</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={item} className="text-center">
          <h2 className="text-4xl font-['Press_Start_2P'] text-white mb-6">READY TO BEGIN?</h2>
          <p className="text-lg text-gray-300 mb-8 font-['Press_Start_2P']">
            Join thousands of adventurers on their productivity quest!
          </p>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-12 py-6 pixel-btn font-['Press_Start_2P'] text-lg transition-all duration-200 hover:scale-105 shadow-xl"
          >
            CREATE ACCOUNT
          </Link>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 border-t-4 border-yellow-400 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 font-['Press_Start_2P'] text-xs">
            © 2024 QUESTIFY. LEVEL UP YOUR LIFE.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;