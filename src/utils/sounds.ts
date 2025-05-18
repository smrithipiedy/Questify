// Sound effect URLs
export const SOUND_EFFECTS = {
  BUTTON_CLICK: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-mechanical-bling-210.mp3',
  TASK_COMPLETE: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
  REWARD_UNLOCK: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
  TIMER_END: 'https://assets.mixkit.co/sfx/preview/mixkit-fairy-arcade-sparkle-866.mp3',
  LEVEL_UP: 'https://assets.mixkit.co/sfx/preview/mixkit-extra-bonus-in-a-video-game-2045.mp3',
  ERROR: 'https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3',
  PURCHASE: 'https://assets.mixkit.co/sfx/preview/mixkit-coins-handling-1939.mp3',
  CHARACTER_UNLOCK: 'https://assets.mixkit.co/sfx/preview/mixkit-magical-surprise-sparkle-671.mp3',
  BUDDY_TIP: 'https://assets.mixkit.co/sfx/preview/mixkit-happy-bell-alert-601.mp3',
  VICTORY: 'https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3'
};

// Play a sound effect
export const playSound = (sound: keyof typeof SOUND_EFFECTS) => {
  try {
    const audio = new Audio(SOUND_EFFECTS[sound]);
    audio.volume = 0.5; // 50% volume
    audio.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};