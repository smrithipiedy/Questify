import React, { useState, useEffect } from 'react';
import { Timer, XCircle, Volume2, VolumeX, Shield, Clock } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { playSound } from '../utils/sounds';
import StudyBuddy from './StudyBuddy';
import Modal from 'react-modal';

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
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);
  const [breakDuration, setBreakDuration] = useState<number>(5);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Handle social media blocking
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

          // Create notification blocking rules
          if ("setAppBadgeNotification" in navigator) {
            socialMediaDomains.forEach(domain => {
              // This is a simplified example - actual implementation would require system-level permissions
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
      
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            if (soundEnabled) {
              playSound('TIMER_END');
            }
            
            if (currentSession.isBreak) {
              endFocusSession();
              setShowCompletionModal(true);
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
    if (!isBreak) {
      setFocusDuration(duration);
      setShowTimerModal(true);
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

  const handleConfirmTimer = () => {
    if (soundEnabled) {
      playSound('BUTTON_CLICK');
    }
    
    startFocusSession(focusDuration, selectedCharacter, false);
    setShowTimerModal(false);
  };

  const handleStartBreak = () => {
    setShowBreakModal(false);
    handleStartSession(breakDuration, true);
  };

  const handleSkipBreak = () => {
    setShowBreakModal(false);
    endFocusSession();
    setShowCompletionModal(true);
  };

  const handleEndSession = () => {
    if (soundEnabled) {
      playSound('BUTTON_CLICK');
    }
    endFocusSession();
    setShowCompletionModal(true);
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
    <div className="bg-gray-900 p-6 rounded-lg pixel-border">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-lg text-white mb-4 md:mb-0 flex items-center font-['Press_Start_2P']">
          <Shield size={20} className="mr-2 text-blue-400" />
          {currentSession?.isBreak ? 'Break Time' : 'Focus Mode'}
        </h2>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSound}
            className="bg-gray-700 text-white p-2 rounded-full pixel-corners"
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
              <div className={`w-10 h-6 ${blockSocialMedia ? 'bg-green-500' : 'bg-gray-700'} pixel-corners transition-colors`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 bg-white pixel-corners transition-transform ${blockSocialMedia ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-2 text-white text-xs font-['Press_Start_2P']">Block Social Media</span>
          </label>
        </div>
      </div>

      {currentSession ? (
        <div className="bg-gray-800 p-6 rounded-lg pixel-box animate-pixelate">
          <div className="flex flex-col items-center mb-4">
            <h3 className="text-2xl font-bold text-white mb-2 font-['Press_Start_2P']">{formatTime(timeLeft)}</h3>
            <p className="text-gray-400 text-xs font-['Press_Start_2P']">
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
            <div className="bg-red-900 p-4 mb-6 text-center pixel-corners">
              <p className="text-white text-xs font-['Press_Start_2P']">🛡️ Distractions Blocked</p>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={handleEndSession}
              className="bg-red-500 text-white px-4 py-2 flex items-center pixel-btn font-['Press_Start_2P'] text-xs"
            >
              <XCircle size={16} className="mr-2" />
              End Session
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg pixel-box">
          {characters.some(c => c.unlocked) && (
            <div className="mb-6">
              <label className="block text-white mb-2 font-['Press_Start_2P'] text-xs">
                Select Study Buddy:
              </label>
              <select
                value={selectedCharacter || ''}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 pixel-corners font-['Press_Start_2P'] text-xs"
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
          
          <p className="text-gray-300 mb-6 text-center font-['Press_Start_2P'] text-xs">
            Start a focused work session to boost your productivity!
            {blockSocialMedia && " All distractions will be blocked during your focus time."}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleStartSession(15)}
              className="bg-blue-600 text-white p-3 pixel-btn flex flex-col items-center justify-center font-['Press_Start_2P'] text-xs"
            >
              <Timer size={24} className="mb-2" />
              <span className="text-lg font-bold">15:00</span>
              <span>Short Focus</span>
            </button>
            
            <button
              onClick={() => handleStartSession(25)}
              className="bg-green-600 text-white p-3 pixel-btn flex flex-col items-center justify-center font-['Press_Start_2P'] text-xs"
            >
              <Timer size={24} className="mb-2" />
              <span className="text-lg font-bold">25:00</span>
              <span>Pomodoro</span>
            </button>
            
            <button
              onClick={() => handleStartSession(50)}
              className="bg-purple-600 text-white p-3 pixel-btn flex flex-col items-center justify-center font-['Press_Start_2P'] text-xs"
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
        isOpen={showTimerModal}
        onRequestClose={() => setShowTimerModal(false)}
        className="bg-gray-900 p-6 rounded-lg pixel-border max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      >
        <h3 className="text-white font-['Press_Start_2P'] text-lg mb-4">Timer Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-['Press_Start_2P'] text-xs">
              Focus Duration (minutes):
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={focusDuration}
              onChange={(e) => setFocusDuration(Math.min(120, Math.max(1, parseInt(e.target.value))))}
              className="w-full bg-gray-700 text-white p-2 pixel-corners font-['Press_Start_2P'] text-xs"
            />
          </div>
          <div>
            <label className="block text-white mb-2 font-['Press_Start_2P'] text-xs">
              Break Duration (minutes):
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Math.min(30, Math.max(1, parseInt(e.target.value))))}
              className="w-full bg-gray-700 text-white p-2 pixel-corners font-['Press_Start_2P'] text-xs"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowTimerModal(false)}
              className="bg-red-500 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmTimer}
              className="bg-green-500 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs"
            >
              Start Session
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showBreakModal}
        onRequestClose={() => setShowBreakModal(false)}
        className="bg-gray-900 p-6 rounded-lg pixel-border max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      >
        <h3 className="text-white font-['Press_Start_2P'] text-lg mb-4">Take a Break?</h3>
        <p className="text-gray-300 font-['Press_Start_2P'] text-xs mb-6">
          Great work on your focus session! Would you like to take a break?
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-['Press_Start_2P'] text-xs">
              Break Duration (minutes):
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Math.min(30, Math.max(1, parseInt(e.target.value))))}
              className="w-full bg-gray-700 text-white p-2 pixel-corners font-['Press_Start_2P'] text-xs mb-4"
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleSkipBreak}
              className="bg-red-500 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs"
            >
              Skip Break
            </button>
            <button
              onClick={handleStartBreak}
              className="bg-green-500 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs"
            >
              Start Break
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCompletionModal}
        onRequestClose={() => setShowCompletionModal(false)}
        className="bg-gray-900 p-6 rounded-lg pixel-border max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      >
        <div className="text-center">
          <h3 className="text-white font-['Press_Start_2P'] text-lg mb-4">
            Great job, keep it up! 🎉
          </h3>
          <p className="text-gray-300 font-['Press_Start_2P'] text-xs mb-6">
            You've completed your focus session. Remember, consistency is key to success!
          </p>
          <button
            onClick={() => setShowCompletionModal(false)}
            className="bg-green-500 text-white px-4 py-2 pixel-btn font-['Press_Start_2P'] text-xs"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FocusMode;