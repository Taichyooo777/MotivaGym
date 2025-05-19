import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Goal } from '@/types/workout';
import Colors from '@/constants/colors';
import { Calendar, Target } from 'lucide-react-native';
import ProgressCircle from './ProgressCircle';

type GoalCardProps = {
  goal: Goal;
  onPress: (goal: Goal) => void;
};

export default function GoalCard({ goal, onPress }: GoalCardProps) {
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString?: string) => {
    if (!dateString) return null;
    
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(goal.targetDate);
  
  // Get goal type label
  const getGoalTypeLabel = (type: Goal['type']) => {
    const labels = {
      strength: 'Strength',
      endurance: 'Endurance',
      weight: 'Weight',
      habit: 'Habit',
      custom: 'Custom'
    };
    return labels[type];
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        goal.completed && styles.completedContainer
      ]} 
      onPress={() => onPress(goal)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{goal.title}</Text>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{getGoalTypeLabel(goal.type)}</Text>
          </View>
        </View>
        
        {goal.description && (
          <Text style={styles.description} numberOfLines={2}>
            {goal.description}
          </Text>
        )}
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Calendar size={16} color={Colors.textLight} />
            <Text style={styles.detailText}>
              {goal.targetDate ? `Due: ${formatDate(goal.targetDate)}` : 'No deadline'}
            </Text>
          </View>
          
          {daysRemaining !== null && (
            <View style={styles.detailRow}>
              <Target size={16} color={Colors.textLight} />
              <Text 
                style={[
                  styles.detailText,
                  daysRemaining < 0 && styles.overdue,
                  daysRemaining <= 3 && daysRemaining >= 0 && styles.urgent
                ]}
              >
                {daysRemaining < 0 
                  ? `${Math.abs(daysRemaining)} days overdue` 
                  : daysRemaining === 0 
                    ? 'Due today' 
                    : `${daysRemaining} days remaining`}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressCircle 
          progress={goal.progress} 
          size={70} 
          strokeWidth={8}
          color={goal.completed ? Colors.success : Colors.primary}
        >
          <Text style={styles.progressText}>{goal.progress}%</Text>
        </ProgressCircle>
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
    flexDirection: 'row',
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
  content: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  typeTag: {
    backgroundColor: Colors.primary + '20', // 20% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
  },
  details: {
    marginTop: 'auto',
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
  overdue: {
    color: Colors.danger,
  },
  urgent: {
    color: Colors.warning,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});