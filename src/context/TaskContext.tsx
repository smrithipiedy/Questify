import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { Task, Reward, FocusSession, Stats, TaskStatus, Character } from '../types';
import { getRandomReward } from '../utils/rewards';
import { characters as initialCharacters } from '../utils/characters';
import { playSound } from '../utils/sounds';

interface TaskState {
  tasks: Task[];
  rewards: Reward[];
  focusSessions: FocusSession[];
  stats: Stats;
  currentSession: FocusSession | null;
  characters: Character[];
  taskHistory: any[];
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'ADD_REWARD'; payload: Reward }
  | { type: 'START_FOCUS_SESSION'; payload: FocusSession }
  | { type: 'END_FOCUS_SESSION'; payload: { endTime: Date; completed: boolean } }
  | { type: 'UPDATE_STATS'; payload: Partial<Stats> }
  | { type: 'UNLOCK_CHARACTER'; payload: { characterId: string; cost: number } };

const initialState: TaskState = {
  tasks: [],
  rewards: [],
  focusSessions: [],
  stats: {
    tasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalFocusTime: 0,
    rewardsCollected: 0,
    coins: 0,
  },
  currentSession: null,
  characters: initialCharacters,
  taskHistory: [],
};

const loadState = (): TaskState => {
  try {
    const savedState = localStorage.getItem('8bitTaskState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      
      return {
        ...parsedState,
        tasks: parsedState.tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        })),
        rewards: parsedState.rewards.map((reward: any) => ({
          ...reward,
          unlockedAt: new Date(reward.unlockedAt),
        })),
        focusSessions: parsedState.focusSessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
        })),
        currentSession: parsedState.currentSession
          ? {
              ...parsedState.currentSession,
              startTime: new Date(parsedState.currentSession.startTime),
              endTime: parsedState.currentSession.endTime
                ? new Date(parsedState.currentSession.endTime)
                : undefined,
            }
          : null,
        characters: parsedState.characters || initialCharacters,
        taskHistory: parsedState.taskHistory || [],
      };
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return initialState;
};

const calculateTaskCoins = (task: Task): number => {
  const baseCoins = 10;
  const priorityMultiplier = {
    low: 1,
    medium: 2,
    high: 3,
  };
  
  return baseCoins * priorityMultiplier[task.priority];
};

const calculateFocusCoins = (duration: number): number => {
  // 1 coin per minute of focus
  return Math.floor(duration);
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isConsecutiveDay = (date1: Date, date2: Date): boolean => {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((date2.getTime() - date1.getTime()) / oneDayMs);
  return diffDays === 1;
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        taskHistory: [...state.taskHistory, {
          id: crypto.randomUUID(),
          task_id: action.payload.id,
          action: 'CREATED',
          created_at: new Date().toISOString(),
          details: {
            title: action.payload.title,
            description: action.payload.description,
            priority: action.payload.priority
          }
        }]
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case 'DELETE_TASK': {
      const deletedTask = state.tasks.find(task => task.id === action.payload);
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        taskHistory: [...state.taskHistory, {
          id: crypto.randomUUID(),
          task_id: action.payload,
          action: 'DELETED',
          created_at: new Date().toISOString(),
          details: deletedTask ? {
            title: deletedTask.title,
            description: deletedTask.description,
            priority: deletedTask.priority
          } : null
        }]
      };
    }

    case 'COMPLETE_TASK': {
      const completedTask = state.tasks.find((task) => task.id === action.payload);
      if (!completedTask) return state;

      const earnedCoins = calculateTaskCoins(completedTask);
      const newReward = {
        ...getRandomReward(),
        coins: earnedCoins,
        source: 'task' as const
      };

      playSound('VICTORY');

      const updatedTask = {
        ...completedTask,
        status: 'completed' as TaskStatus,
        completedAt: new Date(),
      };

      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload ? updatedTask : task)),
        rewards: [...state.rewards, newReward],
        taskHistory: [...state.taskHistory, {
          id: crypto.randomUUID(),
          task_id: action.payload,
          action: 'COMPLETED',
          created_at: new Date().toISOString(),
          details: {
            title: completedTask.title,
            description: completedTask.description,
            priority: completedTask.priority,
            reward: newReward
          }
        }],
        stats: {
          ...state.stats,
          tasksCompleted: state.stats.tasksCompleted + 1,
          rewardsCollected: state.stats.rewardsCollected + 1,
          coins: state.stats.coins + earnedCoins,
        },
      };
    }

    case 'ADD_REWARD':
      return {
        ...state,
        rewards: [...state.rewards, action.payload],
        stats: {
          ...state.stats,
          rewardsCollected: state.stats.rewardsCollected + 1,
          coins: state.stats.coins + action.payload.coins,
        },
      };

    case 'START_FOCUS_SESSION': {
      const today = new Date();
      let newPomodoroStreak = state.stats.pomodoroStreak || 0;
      let lastPomodoroDate = state.stats.lastPomodoroDate;

      if (!lastPomodoroDate || !isSameDay(new Date(lastPomodoroDate), today)) {
        if (lastPomodoroDate && isConsecutiveDay(new Date(lastPomodoroDate), today)) {
          newPomodoroStreak += 1;
        } else {
          newPomodoroStreak = 1;
        }
        lastPomodoroDate = today;
      }

      return {
        ...state,
        currentSession: action.payload,
        focusSessions: [...state.focusSessions, action.payload],
        stats: {
          ...state.stats,
          pomodoroStreak: newPomodoroStreak,
          lastPomodoroDate
        }
      };
    }

    case 'END_FOCUS_SESSION': {
      if (!state.currentSession) return state;

      const endedSession = {
        ...state.currentSession,
        endTime: action.payload.endTime,
      };

      const sessionDurationMinutes =
        (endedSession.endTime!.getTime() - endedSession.startTime.getTime()) / (1000 * 60);

      let newReward = null;
      let earnedCoins = 0;

      if (action.payload.completed) {
        earnedCoins = calculateFocusCoins(sessionDurationMinutes);
        newReward = {
          ...getRandomReward(),
          coins: earnedCoins,
          source: 'focus',
        };
      }

      return {
        ...state,
        currentSession: null,
        focusSessions: state.focusSessions.map((session) =>
          session.id === endedSession.id ? endedSession : session
        ),
        rewards: newReward ? [...state.rewards, newReward] : state.rewards,
        stats: {
          ...state.stats,
          totalFocusTime: state.stats.totalFocusTime + sessionDurationMinutes,
          rewardsCollected: newReward ? state.stats.rewardsCollected + 1 : state.stats.rewardsCollected,
          coins: state.stats.coins + earnedCoins,
        },
      };
    }

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload,
        },
      };

    case 'UNLOCK_CHARACTER':
      if (state.stats.coins < action.payload.cost) return state;

      return {
        ...state,
        characters: state.characters.map(character =>
          character.id === action.payload.characterId
            ? { ...character, unlocked: true }
            : character
        ),
        stats: {
          ...state.stats,
          coins: state.stats.coins - action.payload.cost,
        },
      };

    default:
      return state;
  }
};

interface TaskContextProps {
  state: TaskState;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => Reward;
  startFocusSession: (duration: number, characterId?: string, isBreak?: boolean) => void;
  endFocusSession: (completed: boolean) => Reward | null;
  unlockCharacter: (characterId: string, cost: number) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState, loadState);

  useEffect(() => {
    localStorage.setItem('8bitTaskState', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const checkStreak = () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const completedToday = state.tasks.some(
        (task) =>
          task.completedAt &&
          task.completedAt.getDate() === today.getDate() &&
          task.completedAt.getMonth() === today.getMonth() &&
          task.completedAt.getFullYear() === today.getFullYear()
      );

      const completedYesterday = state.tasks.some(
        (task) =>
          task.completedAt &&
          task.completedAt.getDate() === yesterday.getDate() &&
          task.completedAt.getMonth() === yesterday.getMonth() &&
          task.completedAt.getFullYear() === yesterday.getFullYear()
      );

      let newStreak = state.stats.currentStreak;

      if (completedToday) {
        if (completedYesterday || state.stats.currentStreak === 0) {
          newStreak = state.stats.currentStreak + 1;
        }
      } else if (!completedYesterday) {
        newStreak = 0;
      }

      if (newStreak !== state.stats.currentStreak) {
        dispatch({
          type: 'UPDATE_STATS',
          payload: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.stats.longestStreak),
          },
        });
      }
    };

    checkStreak();

    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - new Date().getTime();

    const timer = setTimeout(checkStreak, timeUntilMidnight);
    return () => clearTimeout(timer);
  }, [state.stats.currentStreak, state.stats.longestStreak, state.tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const completeTask = (id: string): Reward => {
    dispatch({ type: 'COMPLETE_TASK', payload: id });
    const reward = state.rewards[state.rewards.length - 1];
    return reward;
  };

  const startFocusSession = (duration: number, characterId?: string, isBreak?: boolean) => {
    const newSession: FocusSession = {
      id: crypto.randomUUID(),
      startTime: new Date(),
      duration,
      characterId,
      isBreak,
    };
    dispatch({ type: 'START_FOCUS_SESSION', payload: newSession });
  };

  const endFocusSession = (completed: boolean): Reward | null => {
    dispatch({ 
      type: 'END_FOCUS_SESSION', 
      payload: { 
        endTime: new Date(),
        completed
      } 
    });
    
    if (completed && state.rewards.length > 0) {
      return state.rewards[state.rewards.length - 1];
    }
    return null;
  };

  const unlockCharacter = (characterId: string, cost: number) => {
    dispatch({ type: 'UNLOCK_CHARACTER', payload: { characterId, cost } });
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        startFocusSession,
        endFocusSession,
        unlockCharacter,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};