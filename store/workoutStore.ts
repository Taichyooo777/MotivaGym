import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, Goal, UserStats, WorkoutHistory } from '@/types/workout';
import { motivationalQuotes } from '@/constants/motivationalQuotes';

interface WorkoutState {
  workouts: Workout[];
  workoutHistory: WorkoutHistory[];
  goals: Goal[];
  userStats: UserStats;
  todaysQuote: string;
  
  // Actions
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  completeWorkout: (id: string) => void;
  
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  
  refreshDailyQuote: () => void;
}

// Helper to get a random quote
const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

// Initial user stats
const initialUserStats: UserStats = {
  streak: 0,
  totalWorkouts: 0,
  thisWeekWorkouts: 0,
  thisMonthWorkouts: 0,
  personalBests: [],
};

const isWeb = typeof window !== 'undefined';

const storage = {
  getItem: async (name: string) => {
    try {
      if (isWeb) {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : null;
      }
      const value = await AsyncStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('Error getting workout data:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      if (isWeb) {
        localStorage.setItem(name, value);
      } else {
        await AsyncStorage.setItem(name, value);
      }
    } catch (error) {
      console.warn('Error setting workout data:', error);
    }
  },
  removeItem: async (name: string) => {
    try {
      if (isWeb) {
        localStorage.removeItem(name);
      } else {
        await AsyncStorage.removeItem(name);
      }
    } catch (error) {
      console.warn('Error removing workout data:', error);
    }
  },
};

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      workouts: [],
      workoutHistory: [],
      goals: [],
      userStats: initialUserStats,
      todaysQuote: getRandomQuote(),
      
      addWorkout: (workout) => set((state) => ({
        workouts: [...state.workouts, workout]
      })),
      
      updateWorkout: (workout) => set((state) => ({
        workouts: state.workouts.map((w) => 
          w.id === workout.id ? workout : w
        )
      })),
      
      deleteWorkout: (id) => set((state) => ({
        workouts: state.workouts.filter((w) => w.id !== id)
      })),
      
      completeWorkout: (id) => set((state) => {
        const workout = state.workouts.find(w => w.id === id);
        if (!workout) return state;
        
        const now = new Date();
        const workoutDate = new Date(workout.date);
        
        // Calculate workout duration (mock - in a real app this would be tracked)
        const duration = Math.floor(Math.random() * 30) + 30; // 30-60 minutes
        
        // Create workout history entry
        const historyEntry: WorkoutHistory = {
          date: now.toISOString(),
          workoutId: id,
          duration,
          exerciseCount: workout.exercises.length,
          intensity: duration > 50 ? 'intense' : duration > 35 ? 'moderate' : 'light',
        };
        
        // Update streak logic
        let streak = state.userStats.streak;
        const lastWorkout = state.workoutHistory[state.workoutHistory.length - 1];
        
        if (lastWorkout) {
          const lastWorkoutDate = new Date(lastWorkout.date);
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastWorkoutDate.toDateString() === yesterday.toDateString() || 
              lastWorkoutDate.toDateString() === now.toDateString()) {
            streak += 1;
          } else {
            streak = 1; // Reset streak if not consecutive
          }
        } else {
          streak = 1; // First workout
        }
        
        // Count workouts this week and month
        const thisWeekWorkouts = state.workoutHistory.filter(w => {
          const wDate = new Date(w.date);
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          return wDate >= startOfWeek;
        }).length + 1;
        
        const thisMonthWorkouts = state.workoutHistory.filter(w => {
          const wDate = new Date(w.date);
          return wDate.getMonth() === now.getMonth() && 
                 wDate.getFullYear() === now.getFullYear();
        }).length + 1;
        
        return {
          workouts: state.workouts.map(w => 
            w.id === id ? { ...w, completed: true } : w
          ),
          workoutHistory: [...state.workoutHistory, historyEntry],
          userStats: {
            ...state.userStats,
            streak,
            totalWorkouts: state.userStats.totalWorkouts + 1,
            thisWeekWorkouts,
            thisMonthWorkouts,
          }
        };
      }),
      
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, goal]
      })),
      
      updateGoal: (goal) => set((state) => ({
        goals: state.goals.map((g) => 
          g.id === goal.id ? goal : g
        )
      })),
      
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),
      
      completeGoal: (id) => set((state) => ({
        goals: state.goals.map((g) => 
          g.id === id ? { ...g, completed: true, progress: 100 } : g
        )
      })),
      
      updateGoalProgress: (id, progress) => set((state) => ({
        goals: state.goals.map((g) => 
          g.id === id ? { ...g, progress, completed: progress >= 100 } : g
        )
      })),
      
      refreshDailyQuote: () => set({
        todaysQuote: getRandomQuote()
      }),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        workouts: state.workouts,
        workoutHistory: state.workoutHistory,
        goals: state.goals,
        userStats: state.userStats,
        todaysQuote: state.todaysQuote,
      }),
      skipHydration: false,
    }
  )
);