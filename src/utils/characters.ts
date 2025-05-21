import { Character } from '../types';

export const characters: Character[] = [
  {
    id: 'wizard',
    name: 'Professor Pixel',
    description: 'A wise wizard who helps with analytical tasks and problem-solving.',
    imageUrl: '[character image file here]',
    cost: 100,
    personality: 'analytical',
    unlocked: false,
    tips: [
      "Break down complex problems into smaller steps",
      "Try using the Feynman technique to understand difficult concepts",
      "Take short breaks every 25 minutes to maintain focus",
      "Create a mind map to organize your thoughts"
    ]
  },
  {
    id: 'knight',
    name: 'Sir Bytealot',
    description: 'A brave knight who encourages persistence and dedication.',
    imageUrl: '[character image file here]',
    cost: 150,
    personality: 'encouraging',
    unlocked: false,
    tips: [
      "You're making great progress! Keep going!",
      "Remember why you started this journey",
      "Each small step brings you closer to your goal",
      "Take pride in your achievements, no matter how small"
    ]
  },
  {
    id: 'artist',
    name: 'Luna Palette',
    description: 'A creative spirit who helps with innovative thinking.',
    imageUrl: '[character image file here]',
    cost: 200,
    personality: 'creative',
    unlocked: false,
    tips: [
      "Try approaching the problem from a different angle",
      "Visualize your end goal to stay motivated",
      "Use color coding to organize your thoughts",
      "Take inspiration from unexpected sources"
    ]
  },
  {
    id: 'strategist',
    name: 'Commander Cache',
    description: 'A tactical genius who helps with planning and organization.',
    imageUrl: '[character image file here]',
    cost: 250,
    personality: 'strategic',
    unlocked: false,
    tips: [
      "Plan your work in sprints for better focus",
      "Identify and eliminate potential distractions",
      "Set clear milestones for your task",
      "Prioritize tasks based on importance and urgency"
    ]
  },
  {
    id: 'sage',
    name: 'Master Mindful',
    description: 'A meditation master who helps with focus and concentration.',
    imageUrl: '[character image file here]',
    cost: 300,
    personality: 'encouraging',
    unlocked: false,
    tips: [
      "Focus on your breath to center yourself",
      "Practice mindfulness during study sessions",
      "Stay present in the moment",
      "Let go of distracting thoughts gently"
    ]
  },
  {
    id: 'scientist',
    name: 'Dr. Data',
    description: 'A brilliant scientist who helps with research and analysis.',
    imageUrl: '[character image file here]',
    cost: 350,
    personality: 'analytical',
    unlocked: false,
    tips: [
      "Analyze patterns in your study habits",
      "Test different learning methods",
      "Document your findings",
      "Review and iterate your approach"
    ]
  },
  {
    id: 'explorer',
    name: 'Adventure Alex',
    description: 'An explorer who makes learning an exciting journey.',
    imageUrl: '[character image file here]',
    cost: 400,
    personality: 'creative',
    unlocked: false,
    tips: [
      "Turn your study session into an adventure",
      "Discover new ways to learn",
      "Explore different subjects",
      "Make learning fun and engaging"
    ]
  },
  {
    id: 'librarian',
    name: 'Sage Scholar',
    description: 'A knowledgeable librarian who helps organize information.',
    imageUrl: '[character image file here]',
    cost: 450,
    personality: 'strategic',
    unlocked: false,
    tips: [
      "Categorize your study materials",
      "Create effective study guides",
      "Use efficient note-taking methods",
      "Build a knowledge management system"
    ]
  }
];

export const getRandomTip = (character: Character): string => {
  const randomIndex = Math.floor(Math.random() * character.tips.length);
  return character.tips[randomIndex];
};

export const unlockCharacter = (characterId: string, characters: Character[]): Character[] => {
  return characters.map(character => 
    character.id === characterId 
      ? { ...character, unlocked: true }
      : character
  );
};