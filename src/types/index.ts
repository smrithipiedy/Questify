export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  completedAt?: Date;
  focusTime?: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cost: number;
  personality: 'encouraging' | 'analytical' | 'creative' | 'strategic';
  unlocked: boolean;
  tips: string[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  imageUrl: string;
  unlockedAt: Date;
  coins: number;
}

export interface FocusSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  taskId?: string;
  characterId?: string;
  isBreak?: boolean;
}

export interface Stats {
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalFocusTime: number; // in minutes
  rewardsCollected: number;
  coins: number;
  pomodoroStreak: number;
  lastPomodoroDate?: Date;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  focusTime: number;
  score: number;
  rank: number;
}