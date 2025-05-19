export type ExerciseCategory = 
  | 'strength' 
  | 'cardio' 
  | 'flexibility' 
  | 'balance';

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: string[];
  description: string;
};

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Bench Press',
    category: 'strength',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    description: 'Lie on a flat bench and press weight upward using both arms.'
  },
  {
    id: '2',
    name: 'Squat',
    category: 'strength',
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'lower back'],
    description: 'Lower your body as if sitting in an invisible chair, then return to standing position.'
  },
  {
    id: '3',
    name: 'Deadlift',
    category: 'strength',
    muscleGroups: ['lower back', 'hamstrings', 'glutes', 'traps'],
    description: 'Lift a weighted barbell off the ground to hip level, then lower it back down.'
  },
  {
    id: '4',
    name: 'Pull-up',
    category: 'strength',
    muscleGroups: ['lats', 'biceps', 'middle back'],
    description: 'Hang from a bar and pull your body upward until your chin is above the bar.'
  },
  {
    id: '5',
    name: 'Running',
    category: 'cardio',
    muscleGroups: ['quadriceps', 'hamstrings', 'calves', 'core'],
    description: 'Run at a steady pace to improve cardiovascular endurance.'
  },
  {
    id: '6',
    name: 'Plank',
    category: 'strength',
    muscleGroups: ['core', 'shoulders', 'back'],
    description: 'Hold a position similar to a push-up, with weight on forearms and toes.'
  },
  {
    id: '7',
    name: 'Shoulder Press',
    category: 'strength',
    muscleGroups: ['shoulders', 'triceps'],
    description: 'Press weights upward from shoulder height until arms are fully extended.'
  },
  {
    id: '8',
    name: 'Bicycle Crunch',
    category: 'strength',
    muscleGroups: ['abs', 'obliques'],
    description: 'Lie on your back and simulate pedaling a bicycle with your legs while touching elbows to opposite knees.'
  },
  {
    id: '9',
    name: 'Jumping Rope',
    category: 'cardio',
    muscleGroups: ['calves', 'shoulders', 'arms', 'core'],
    description: 'Jump over a rope swinging beneath your feet and over your head.'
  },
  {
    id: '10',
    name: 'Lunges',
    category: 'strength',
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    description: 'Take a step forward and lower your body until both knees are bent at 90-degree angles.'
  }
];