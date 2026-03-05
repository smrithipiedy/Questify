import React, { useState, useEffect } from 'react';
import { Timer, XCircle, Volume2, VolumeX, Shield, Clock } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { playSound } from '../utils/sounds';
import StudyBuddy from './StudyBuddy';
import Modal from 'react-modal';
import VictoryEffect from './VictoryEffect';

Modal.setAppElement('#root');

const FocusMode: React.FC = () => {
  const { state, startFocusSession, endFocusSession } = useTaskContext();
  const { currentSession, characters = [] } = state;
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [blockSocialMedia, setBlockSocialMedia] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [focusDuration, setFocusDuration] = useState<number>(25);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showBreakModal, setShowBreakModal] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  const [currentReward, setCurrentReward] = useState<any>(null);
  const [showVictoryEffect, setShowVictoryEffect] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [showCustomTimer, setShowCustomTimer] = useState<boolean>(true);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        if (blockSocialMedia) {
          const socialMediaDomains = [
            "instagram.com",
            "twitter.com",
            "facebook.com",
            "tiktok.com",
            "telegram.org",
            "whatsapp.com",
            "youtube.com"
          ];

          if ("setAppBadgeNotification" in navigator) {
            socialMediaDomains.forEach(domain => {
              console.log(`Blocking notifications from ${domain}`);
            });
          }
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  useEffect(() => {
    if (blockSocialMedia) {
      requestNotificationPermission();
    }
  }, [blockSocialMedia]);

  useEffect(() => {
    if (currentSession) {
      if (Notification.permission === 'granted') {
        Notification.requestPermission();
      }

      const sessionDurationMs = currentSession.duration * 60 * 1000;
      const endTime = new Date(currentSession.startTime.getTime() + sessionDurationMs);
      const remainingTime = Math.max(0, endTime.getTime() - new Date().getTime());
      
      setTimeLeft(Math.floor(remainingTime / 1000));
      setSessionStartTime(currentSession.startTime);
      
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            if (soundEnabled) {
              playSound('TIMER_END');
            }
            
            if (currentSession.isBreak) {
              const reward = endFocusSession(true);
              if (reward) {
                setCurrentReward(reward);
                setShowVictoryEffect(true);
              }
            } else {
              new Notification('Focus Session Complete!', {
                body: 'Would you like to take a break?',
              });
              setShowBreakModal(true);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentSession, endFocusSession, soundEnabled]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = (duration: number, isBreak: boolean = false) => {
    setShowCustomTimer(false);
    if (!isBreak) {
      setFocusDuration(duration);
      if (soundEnabled) {
        playSound('BUTTON_CLICK');
      }
      startFocusSession(duration, selectedCharacter, false);
    } else {
      if (soundEnabled) {
        playSound('BUTTON_CLICK');
      }
      
      if (Notification.permission === 'granted') {
        Notification.requestPermission();
      }
      
      startFocusSession(duration, selectedCharacter, isBreak);
    }
  };

  const handleStartBreak = () => {
    setShowBreakModal(false);
    handleStartSession(breakDuration, true);
  };

  const handleSkipBreak = () => {
    setShowBreakModal(false);
    const reward = endFocusSession(true);
    if (reward) {
      setCurrentReward(reward);
      setShowVictoryEffect(true);
    }
  };

  const handleEndSession = () => {
    if (soundEnabled) {
      playSound('BUTTON_CLICK');
    }

    if (sessionStartTime) {
      const elapsedMinutes = (new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60);
      const targetDuration = currentSession?.duration || 0;
      
      const reward = endFocusSession(elapsedMinutes >= targetDuration * 0.95);
      if (reward) {
        setCurrentReward(reward);
        setShowVictoryEffect(true);
      }
    }
    setShowCustomTimer(true);
  };
  
  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const calculateProgress = (): number => {
    if (!currentSession) return 0;
    const totalSeconds = currentSession.duration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const activeCharacter = characters.find(c => c.id === selectedCharacter && c.unlocked);

  return (
    <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg pixel-border transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-lg text-white dark:text-gray-100 mb-4 md:mb-0 flex items-center font-['Press_Start_2P']">
          <Shield size={20} className="mr-2 text-blue-400 dark:text-blue-300" />
          {currentSession?.isBreak ? 'Break Time' : 'Focus Mode'}
        </h2>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSound}
            className="bg-gray-700 dark:bg-gray-600 text-white p-2 rounded-full pixel-corners hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={blockSocialMedia}
                onChange={() => setBlockSocialMedia(!blockSocialMedia)}
              />
              <div className={`w-10 h-6 ${blockSocialMedia ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-700 dark:bg-gray-600'} pixel-corners transition-colors`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 bg-white pixel-corners transition-transform ${blockSocialMedia ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-2 text-white dark:text-gray-200 text-xs font-['Press_Start_2P']">Block Social Media</span>
          </label>
        </div>
      </div>

      {currentSession ? (
        <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg pixel-box animate-pixelate transition-colors duration-300">
          <div className="flex flex-col items-center mb-4">
            <h3 className="text-2xl font-bold text-white dark:text-gray-100 mb-2 font-['Press_Start_2P']">{formatTime(timeLeft)}</h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-['Press_Start_2P']">
              {currentSession.isBreak ? 'Break Time Remaining' : 'Focus Time Remaining'}
            </p>
          </div>
          
          <div className="mb-6">
            <div className="pixel-progress">
              <div 
                className="pixel-progress-bar"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
          
          {blockSocialMedia && !currentSession.isBreak && (
            <div className="bg-red-900 dark:bg-red-800 p-4 mb-6 text-center pixel-corners transition-colors duration-300">
              <p className="text-white dark:text-gray-100 text-xs font-['Press_Start_2P']">🛡️ Distractions Blocked</p>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={handleEndSession}
              className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 flex items-center pixel-btn font-['Press_Start_2P'] text-xs hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              <XCircle size={16} className="mr-2" />
              End Session
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg pixel-box transition-colors duration-300">
          {characters.some(c => c.unlocked) && (
            <div className="mb-6">
              <label className="block text-white dark:text-gray-200 mb-2 font-['Press_Start_2P'] text-xs">
                Select Study Buddy:
              </label>
              <select
                value={selectedCharacter || ''}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="w-full bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-100 p-2 pixel-corners font-['Press_Start_2P'] text-xs"
              >
                <option value="">None</option>
                {characters.filter(c => c.unlocked).map(character => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showCustomTimer && (
            <div className="mb-6 bg-gray-700 dark:bg-gray-600 p-4 pixel-corners transition-colors duration-300">
              <h3 className="text-white dark:text-gray-100 font-['Press_Start_2P'] text-sm mb-4">Custom Timer Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white dark:text-gray-200 mb-2 font-['Press_Start_2P'] text-xs">
                    Focus Duration (min):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(Math.min(120, Math.max(1, parseInt(e.target.value))))}
                    className="w-full bg-gray-600 dark:bg-gray-500 text-white dark:text-gray-100 p-2 pixel-corners font-['Press_Start_2P'] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-white dark:text-gray-200 mb-2 font-['Press_Start_2P'] text-xs">
                    Break Duration (min):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Math.min(30, Math.max(1, parseInt(e.target.value))))}
                    className="w-full bg-gray-600 dark:bg-gray-500 text-white dark:text-gray-100 p-2 pixel-corners font-['Press_Start_2P'] text-xs"
                  />
                </div>
              </div>
              <button
                onClick={() => handleStartSession(focusDuration)}
                className="w-full bg-blue-600 dark:bg-blue-700 text-white p-2 mt-4 pixel-btn font-['Press_Start_2P'] text-xs hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
              >
                Start Custom Timer
              </button>
            </div>
          )}
          
          <p className="text-gray-300 dark:text-gray-400 mb-6 text-center font-['Press_Start_2P'] text-xs">
            Start a focused work session to boost your productivity!
            {blockSocialMedia && " All distractions will be blocked during your focus time."}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleStartSession(15)}
              className="bg-blue-600 dark:bg-blue-700 text-white p-3 pixel-btn flex flex-col items-center justify-center font-['Press_Start_2P'] text-xs hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              <Timer size={24} className="mb-2" />
              <span className="text-lg font-bold">15:00</span>
              <span>Short Focus</span>
            </button>
            
            <button
              onClick={() => handleStartSession(25)}
              className="bg-green-600 dark:bg-green-700 text-white p-3 pixel-btn flex flex-col items-center justify-center font-['Press_Start_2P'] text-xs hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
            >
              <Timer size={24} className="mb-2" />
              <span className="text-lg font-bold">25:00</span>
              <span>Pomodoro</span>
            </button>
            
            <button
              onClick={() => handleStartSession(50)}
              className="bg-purple-600 dark:bg-purple-700 text-white p-3 pixel-btn flex flex-col items-center justify-center font-['Press_Start_2P'] text-xs hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
            >
              <Timer size={24} className="mb-2" />
              <span className="text-lg font-bold">50:00</span>
              <span>Deep Focus</span>
            </button>
          </div>
        </div>
      )}

      {activeCharacter && currentSession && !currentSession.isBreak && (
        <StudyBuddy character={activeCharacter} isActive={true} />
      )}

      <Modal
        isOpen={showBreakModal}
        onRequestClose={() => setShowBreakModal(false)}
        className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg pixel-border max-w-md mx-auto mt-20 transition-colors duration-300"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      >
        <h3 className="text-white dark:text-gray-100 font-['Press_Start_2P'] text-lg mb-4">Take a Break?</h3>
        <p className="text-gray-300 dark:text-gray-400 font-['Press_Start_2P'] text-xs mb-6">
          Great work on your focus session! Would you like to take a break?
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-white dark:text-gray-200 mb-2 font-['Press_Start_2P'] text-xs">
              Break Duration (minutes):
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Math.min(30, Math.max(1, parseInt(e.target.value))))}
              className="w-full bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-100 p-2 pixel-corners font-['Press_Start_2P'] text-xs mb-4"
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleSkipBreak}
              className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              Skip Break
            </button>
            <button
              onClick={handleStartBreak}
              className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
            >
              Start Break
            </button>
          </div>
        </div>
      </Modal>

      {showVictoryEffect && currentReward && (
        <VictoryEffect
          reward={currentReward}
          onClose={() => {
            setShowVictoryEffect(false);
            setShowCompletionModal(true);
          }}
          source="focus"
        />
      )}

      <Modal
        isOpen={showCompletionModal}
        onRequestClose={() => setShowCompletionModal(false)}
        className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg pixel-border max-w-md mx-auto mt-20 transition-colors duration-300"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      >
        <div className="text-center">
          <h3 className="text-white dark:text-gray-100 font-['Press_Start_2P'] text-lg mb-4">
            Great job, keep it up! 🎉
          </h3>
          <p className="text-gray-300 dark:text-gray-400 font-['Press_Start_2P'] text-xs mb-6">
            You've completed your focus session. Remember, consistency is key to success!
          </p>
          <button
            onClick={() => setShowCompletionModal(false)}
            className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FocusMode;