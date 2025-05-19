import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutStore } from '@/store/workoutStore';
import { useLanguageStore } from '@/store/languageStore';
import Colors from '@/constants/colors';
import StatsCard from '@/components/StatsCard';
import QuoteCard from '@/components/QuoteCard';
import WorkoutCard from '@/components/WorkoutCard';
import GoalCard from '@/components/GoalCard';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();
  const { t } = useLanguageStore();
  const { 
    workouts, 
    goals, 
    userStats, 
    todaysQuote, 
    refreshDailyQuote 
  } = useWorkoutStore();

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter workouts for today
  const todaysWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    return workoutDate.getTime() === today.getTime();
  });

  // Get upcoming workouts (next 7 days)
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    return workoutDate > today && workoutDate <= nextWeek && !workout.completed;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get in-progress goals
  const inProgressGoals = goals
    .filter(goal => !goal.completed)
    .sort((a, b) => b.progress - a.progress);

  // Navigate to workout details
  const handleWorkoutPress = (workout: any) => {
    router.push(`/workout/${workout.id}`);
  };

  // Navigate to goal details
  const handleGoalPress = (goal: any) => {
    router.push(`/goal/${goal.id}`);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 18) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>
        {getGreeting()}, Fitness Warrior!
      </Text>
      
      <StatsCard stats={userStats} />
      
      <QuoteCard 
        quote={todaysQuote} 
        onRefresh={refreshDailyQuote} 
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('workout.create')}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/create-workout')}
        >
          <Ionicons name="add" size={18} color={Colors.primary} />
          <Text style={styles.addButtonText}>{t('common.add')}</Text>
        </TouchableOpacity>
      </View>
      
      {todaysWorkouts.length > 0 ? (
        todaysWorkouts.map(workout => (
          <WorkoutCard 
            key={workout.id} 
            workout={workout} 
            onPress={handleWorkoutPress} 
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('workout.notFound')}</Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => router.push('/create-workout')}
          >
            <Text style={styles.emptyStateButtonText}>{t('workout.create')}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {upcomingWorkouts.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('tabs.workouts')}</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/workouts')}
            >
              <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {upcomingWorkouts.slice(0, 2).map(workout => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onPress={handleWorkoutPress} 
            />
          ))}
        </>
      )}
      
      {inProgressGoals.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('tabs.goals')}</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/goals')}
            >
              <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {inProgressGoals.slice(0, 2).map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onPress={handleGoalPress} 
            />
          ))}
        </>
      )}
    </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15', // 15% opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 2,
  },
  emptyState: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 16,
    textAlign: 'center',
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