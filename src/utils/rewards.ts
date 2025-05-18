import { Reward } from '../types';

// Collection of possible reward items
const rewards: Omit<Reward, 'id' | 'unlockedAt'>[] = [
  {
    name: 'Bronze Coin',
    description: 'A common coin found in every quest.',
    rarity: 'common',
    imageUrl: 'https://i.ibb.co/fXV6FZC/bronze-coin.png',
  },
  {
    name: 'Silver Coin',
    description: 'A valuable coin for your collection.',
    rarity: 'uncommon',
    imageUrl: 'https://i.ibb.co/7r2YXkv/silver-coin.png',
  },
  {
    name: 'Gold Coin',
    description: 'A rare gold coin that shines brightly.',
    rarity: 'rare',
    imageUrl: 'https://i.ibb.co/D9vKtVf/gold-coin.png',
  },
  {
    name: 'Magic Mushroom',
    description: 'Eat this to grow stronger!',
    rarity: 'uncommon',
    imageUrl: 'https://i.ibb.co/4Nj0bKt/mushroom.png',
  },
  {
    name: 'Fire Flower',
    description: 'Grants the power of fire!',
    rarity: 'rare',
    imageUrl: 'https://i.ibb.co/jgBJRJL/fire-flower.png',
  },
  {
    name: 'Star Power',
    description: 'Temporary invincibility!',
    rarity: 'epic',
    imageUrl: 'https://i.ibb.co/tYpjvKy/star.png',
  },
  {
    name: 'Power Heart',
    description: 'Extends your life force.',
    rarity: 'uncommon',
    imageUrl: 'https://i.ibb.co/gWbG78c/heart.png',
  },
  {
    name: 'Mystery Box',
    description: 'Contains a random treasure.',
    rarity: 'rare',
    imageUrl: 'https://i.ibb.co/m0q8ZCQ/mystery-box.png',
  },
  {
    name: 'Golden Key',
    description: 'Opens secret areas.',
    rarity: 'epic',
    imageUrl: 'https://i.ibb.co/2Nbwhpt/key.png',
  },
  {
    name: 'Pixel Sword',
    description: 'A mighty weapon for a true hero.',
    rarity: 'epic',
    imageUrl: 'https://i.ibb.co/GtPMY9K/sword.png',
  },
  {
    name: 'Potion Bottle',
    description: 'Restores your energy.',
    rarity: 'uncommon',
    imageUrl: 'https://i.ibb.co/KDYqzx9/potion.png',
  },
  {
    name: 'Treasure Chest',
    description: 'Full of valuable treasures!',
    rarity: 'rare',
    imageUrl: 'https://i.ibb.co/g3pWPjR/chest.png',
  },
];

// Function to generate a random reward
export const getRandomReward = (): Reward => {
  // Probability weights based on rarity
  const rarityWeights = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 5,
  };
  
  // Calculate total weight
  const totalWeight = Object.values(rarityWeights).reduce((sum, weight) => sum + weight, 0);
  
  // Generate a random number
  const randomNum = Math.random() * totalWeight;
  
  // Find the rarity based on the random number
  let cumulativeWeight = 0;
  let selectedRarity: 'common' | 'uncommon' | 'rare' | 'epic' = 'common';
  
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    cumulativeWeight += weight;
    if (randomNum <= cumulativeWeight) {
      selectedRarity = rarity as 'common' | 'uncommon' | 'rare' | 'epic';
      break;
    }
  }
  
  // Filter rewards by selected rarity
  const rarityRewards = rewards.filter(reward => reward.rarity === selectedRarity);
  
  // Select a random reward from the filtered list
  const randomIndex = Math.floor(Math.random() * rarityRewards.length);
  const selectedReward = rarityRewards[randomIndex];
  
  // Return the reward with a unique ID and timestamp
  return {
    ...selectedReward,
    id: crypto.randomUUID(),
    unlockedAt: new Date(),
  };
};

// Function to get rarity color
export const getRarityColor = (rarity: 'common' | 'uncommon' | 'rare' | 'epic'): string => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-500';
    case 'uncommon':
      return 'bg-green-500';
    case 'rare':
      return 'bg-blue-500';
    case 'epic':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

// Function to get rarity display text
export const getRarityDisplayText = (rarity: 'common' | 'uncommon' | 'rare' | 'epic'): string => {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
};