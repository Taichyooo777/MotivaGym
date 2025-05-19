import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Workout } from '@/types/workout';
import Colors from '@/constants/colors';
import { Calendar, CheckCircle2, Clock } from 'lucide-react-native';
import { exercises } from '@/constants/exercises';

type WorkoutCardProps = {
  workout: Workout;
  onPress: (workout: Workout) => void;
};

export default function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Count total sets
  const totalSets = workout.exercises.reduce(
    (acc, curr) => acc + curr.sets.length,
    0
  );

  // Get exercise names
  const exerciseNames = workout.exercises.map(ex => {
    const exercise = exercises.find(e => e.id === ex.exerciseId);
    return exercise?.name || 'Unknown exercise';
  });

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        workout.completed && styles.completedContainer
      ]} 
      onPress={() => onPress(workout)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        {workout.completed && (
          <CheckCircle2 size={20} color={Colors.success} />
        )}
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={Colors.textLight} />
          <Text style={styles.detailText}>{formatDate(workout.date)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={Colors.textLight} />
          <Text style={styles.detailText}>
            {workout.exercises.length} exercises • {totalSets} sets
          </Text>
        </View>
      </View>
      
      <View style={styles.exerciseList}>
        {exerciseNames.slice(0, 3).map((name, index) => (
          <Text key={index} style={styles.exerciseName} numberOfLines={1}>
            • {name}
          </Text>
        ))}
        {exerciseNames.length > 3 && (
          <Text style={styles.moreExercises}>
            +{exerciseNames.length - 3} more
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedContainer: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 8,
  },
  exerciseList: {
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
    paddingTop: 12,
  },
  exerciseName: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  moreExercises: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
});