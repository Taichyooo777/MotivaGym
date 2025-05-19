import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Platform
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutStore } from '@/store/workoutStore';
import Colors from '@/constants/colors';
import { exercises } from '@/constants/exercises';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  CheckCircle2, 
  Edit2, 
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { workouts, completeWorkout, deleteWorkout } = useWorkoutStore();
  
  const workout = workouts.find(w => w.id === id);
  
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);
  
  if (!workout) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Workout not found</Text>
        <TouchableOpacity 
          style={styles.notFoundButton}
          onPress={() => router.back()}
        >
          <Text style={styles.notFoundButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Toggle exercise expansion
  const toggleExercise = (exerciseId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setExpandedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  // Handle complete workout
  const handleCompleteWorkout = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    Alert.alert(
      'Complete Workout',
      'Mark this workout as completed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Complete',
          onPress: () => {
            completeWorkout(workout.id);
            Alert.alert('Success', 'Workout marked as completed!');
          },
        },
      ]
    );
  };

  // Handle delete workout
  const handleDeleteWorkout = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteWorkout(workout.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: workout.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={() => router.push(`/edit-workout/${workout.id}`)}
                style={styles.headerButton}
              >
                <Edit2 size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDeleteWorkout}
                style={styles.headerButton}
              >
                <Trash2 size={20} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.infoRow}>
            <Calendar size={18} color={Colors.textLight} />
            <Text style={styles.infoText}>{formatDate(workout.date)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={18} color={Colors.textLight} />
            <Text style={styles.infoText}>
              {workout.exercises.length} exercises • {workout.exercises.reduce((acc, curr) => acc + curr.sets.length, 0)} sets
            </Text>
          </View>
          
          {workout.completed && (
            <View style={styles.completedBadge}>
              <CheckCircle2 size={16} color={Colors.success} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
        
        {workout.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{workout.notes}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {workout.exercises.map(exercise => {
            const exerciseData = exercises.find(e => e.id === exercise.exerciseId);
            const isExpanded = expandedExercises.includes(exercise.exerciseId);
            
            return (
              <View key={exercise.exerciseId} style={styles.exerciseCard}>
                <TouchableOpacity 
                  style={styles.exerciseHeader}
                  onPress={() => toggleExercise(exercise.exerciseId)}
                >
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exerciseData?.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exerciseData?.category} • {exercise.sets.length} sets
                    </Text>
                  </View>
                  
                  {isExpanded ? (
                    <ChevronUp size={20} color={Colors.textLight} />
                  ) : (
                    <ChevronDown size={20} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.setsContainer}>
                    <View style={styles.setsHeader}>
                      <Text style={styles.setsHeaderText}>Set</Text>
                      <Text style={styles.setsHeaderText}>Reps</Text>
                      <Text style={styles.setsHeaderText}>Weight (kg)</Text>
                      <Text style={styles.setsHeaderText}>Status</Text>
                    </View>
                    
                    {exercise.sets.map((set, index) => (
                      <View key={set.id} style={styles.setRow}>
                        <Text style={styles.setText}>{index + 1}</Text>
                        <Text style={styles.setText}>{set.reps}</Text>
                        <Text style={styles.setText}>{set.weight}</Text>
                        <View style={styles.setStatus}>
                          {set.completed ? (
                            <CheckCircle size={18} color={Colors.success} />
                          ) : (
                            <View style={styles.uncheckedCircle} />
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        {!workout.completed && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompleteWorkout}
          >
            <CheckCircle2 size={20} color="#fff" />
            <Text style={styles.completeButtonText}>Mark as Completed</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '15', // 15% opacity
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  completedText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
    marginLeft: 4,
  },
  notesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  notesCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notesText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  exercisesSection: {
    marginBottom: 24,
  },
  exerciseCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: Colors.textLight,
  },
  setsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
    padding: 16,
  },
  setsHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  setsHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator + '50', // 50% opacity
  },
  setText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  setStatus: {
    flex: 1,
    alignItems: 'center',
  },
  uncheckedCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.inactive,
  },
  completeButton: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  notFoundButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  notFoundButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});