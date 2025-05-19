import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutStore } from '@/store/workoutStore';
import Colors from '@/constants/colors';
import WorkoutCard from '@/components/WorkoutCard';
import { Plus, Filter } from 'lucide-react-native';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { workouts } = useWorkoutStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter workouts
  const filteredWorkouts = sortedWorkouts.filter(workout => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return !workout.completed;
    if (filter === 'completed') return workout.completed;
    return true;
  });

  // Navigate to workout details
  const handleWorkoutPress = (workout: any) => {
    router.push(`/workout/${workout.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <Filter size={16} color={Colors.textLight} />
          <Text style={styles.filterLabel}>Filter:</Text>
          
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'all' && styles.activeFilterButton,
              ]}
              onPress={() => setFilter('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'all' && styles.activeFilterButtonText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'upcoming' && styles.activeFilterButton,
              ]}
              onPress={() => setFilter('upcoming')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'upcoming' && styles.activeFilterButtonText,
                ]}
              >
                Upcoming
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'completed' && styles.activeFilterButton,
              ]}
              onPress={() => setFilter('completed')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'completed' && styles.activeFilterButtonText,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-workout')}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {filteredWorkouts.length > 0 ? (
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutCard workout={item} onPress={handleWorkoutPress} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No workouts found</Text>
          <Text style={styles.emptyStateText}>
            {filter === 'all'
              ? "You haven't created any workouts yet."
              : filter === 'upcoming'
              ? "You don't have any upcoming workouts."
              : "You haven't completed any workouts yet."}
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => router.push('/create-workout')}
          >
            <Text style={styles.emptyStateButtonText}>Create Workout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
    marginRight: 8,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary + '20', // 20% opacity
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  activeFilterButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});