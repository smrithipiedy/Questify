import { Character } from '../types';

export const characters: Character[] = [
  {
    id: 'wizard',
    name: 'Professor Pixel',
    description: 'A wise wizard who helps with analytical tasks and problem-solving.',
    imageUrl: 'https://i.ibb.co/VqGhZyP/wizard.png',
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
    imageUrl: 'https://i.ibb.co/0jZQYv9/knight.png',
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
    imageUrl: 'https://i.ibb.co/XkQB3vN/artist.png',
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
    imageUrl: 'https://i.ibb.co/wSQX4Bh/strategist.png',
    cost: 250,
    personality: 'strategic',
    unlocked: false,
    tips: [
      "Plan your work in sprints for better focus",
      "Identify and eliminate potential distractions",
      "Set clear milestones for your task",
      "Prioritize tasks based on importance and urgency"
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