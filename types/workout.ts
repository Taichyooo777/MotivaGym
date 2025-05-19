import { Exercise } from '@/constants/exercises';

export type WorkoutSet = {
  id: string;
  exerciseId: string;
  reps?: number;
  weight?: number;
  duration?: number; // in seconds
  distance?: number; // in meters
  completed: boolean;
};

export type Workout = {
  id: string;
  name: string;
  date: string; // ISO string
  exercises: {
    exerciseId: string;
    sets: WorkoutSet[];
  }[];
  notes?: string;
  completed: boolean;
};

export type WorkoutHistory = {
  date: string; // ISO string
  workoutId: string;
  duration: number; // in minutes
  exerciseCount: number;
  intensity: 'light' | 'moderate' | 'intense';
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  targetDate?: string; // ISO string
  completed: boolean;
  progress: number; // 0-100
  type: 'strength' | 'endurance' | 'weight' | 'habit' | 'custom';
  metric?: string;
  targetValue?: number;
  currentValue?: number;
};

export type UserStats = {
  streak: number;
  totalWorkouts: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
  personalBests: {
    exerciseId: string;
    value: number;
    type: 'weight' | 'reps' | 'duration' | 'distance';
    date: string;
  }[];
};