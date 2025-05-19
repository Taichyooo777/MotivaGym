import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutStore } from '@/store/workoutStore';
import Colors from '@/constants/colors';
import { 
  Calendar, 
  Target, 
  Edit2, 
  Trash2,
  CheckCircle2,
  Save
} from 'lucide-react-native';
import ProgressCircle from '@/components/ProgressCircle';
import * as Haptics from 'expo-haptics';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { goals, updateGoal, deleteGoal, completeGoal, updateGoalProgress } = useWorkoutStore();
  
  const goal = goals.find(g => g.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [progressValue, setProgressValue] = useState(goal?.progress.toString() || '0');
  const [currentValue, setCurrentValue] = useState(goal?.currentValue?.toString() || '');
  
  if (!goal) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Goal not found</Text>
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
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
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
  const getGoalTypeLabel = (type: typeof goal.type) => {
    const labels = {
      strength: 'Strength',
      endurance: 'Endurance',
      weight: 'Weight',
      habit: 'Habit',
      custom: 'Custom'
    };
    return labels[type];
  };

  // Handle save progress
  const handleSaveProgress = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    const progress = parseInt(progressValue) || 0;
    
    // Update progress
    updateGoalProgress(goal.id, Math.min(Math.max(0, progress), 100));
    
    // Update current value if provided
    if (currentValue && goal.targetValue) {
      const current = parseFloat(currentValue);
      updateGoal({
        ...goal,
        currentValue: current,
        progress: Math.min(Math.round((current / goal.targetValue) * 100), 100)
      });
    }
    
    setIsEditing(false);
  };

  // Handle complete goal
  const handleCompleteGoal = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    Alert.alert(
      'Complete Goal',
      'Mark this goal as completed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Complete',
          onPress: () => {
            completeGoal(goal.id);
            Alert.alert('Success', 'Goal marked as completed!');
          },
        },
      ]
    );
  };

  // Handle delete goal
  const handleDeleteGoal = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGoal(goal.id);
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
          title: 'Goal Details',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={() => router.push(`/edit-goal/${goal.id}`)}
                style={styles.headerButton}
              >
                <Edit2 size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDeleteGoal}
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
          <View style={styles.titleRow}>
            <Text style={styles.title}>{goal.title}</Text>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{getGoalTypeLabel(goal.type)}</Text>
            </View>
          </View>
          
          {goal.description && (
            <Text style={styles.description}>{goal.description}</Text>
          )}
          
          <View style={styles.infoRow}>
            <Calendar size={18} color={Colors.textLight} />
            <Text style={styles.infoText}>
              {goal.targetDate ? `Due: ${formatDate(goal.targetDate)}` : 'No deadline'}
            </Text>
          </View>
          
          {daysRemaining !== null && (
            <View style={styles.infoRow}>
              <Target size={18} color={Colors.textLight} />
              <Text 
                style={[
                  styles.infoText,
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
          
          {goal.completed && (
            <View style={styles.completedBadge}>
              <CheckCircle2 size={16} color={Colors.success} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
        
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Current Progress</Text>
              {!goal.completed && (
                <TouchableOpacity 
                  onPress={() => setIsEditing(!isEditing)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Edit2 size={18} color={Colors.primary} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.progressContent}>
              <ProgressCircle 
                progress={goal.progress} 
                size={120} 
                strokeWidth={12}
                color={goal.completed ? Colors.success : Colors.primary}
              >
                <Text style={styles.progressValue}>{goal.progress}%</Text>
              </ProgressCircle>
              
              <View style={styles.progressDetails}>
                {goal.targetValue && (
                  <View style={styles.progressDetailRow}>
                    <Text style={styles.progressDetailLabel}>Target:</Text>
                    <Text style={styles.progressDetailValue}>
                      {goal.targetValue} {goal.metric}
                    </Text>
                  </View>
                )}
                
                {goal.currentValue !== undefined && (
                  <View style={styles.progressDetailRow}>
                    <Text style={styles.progressDetailLabel}>Current:</Text>
                    <Text style={styles.progressDetailValue}>
                      {goal.currentValue} {goal.metric}
                    </Text>
                  </View>
                )}
                
                {goal.metric && (
                  <View style={styles.progressDetailRow}>
                    <Text style={styles.progressDetailLabel}>Metric:</Text>
                    <Text style={styles.progressDetailValue}>{goal.metric}</Text>
                  </View>
                )}
              </View>
            </View>
            
            {isEditing && (
              <View style={styles.editProgressSection}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Progress (%)</Text>
                  <TextInput
                    style={styles.input}
                    value={progressValue}
                    onChangeText={setProgressValue}
                    keyboardType="number-pad"
                    placeholder="0-100"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>
                
                {goal.targetValue && (
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Current Value</Text>
                    <TextInput
                      style={styles.input}
                      value={currentValue}
                      onChangeText={setCurrentValue}
                      keyboardType="decimal-pad"
                      placeholder={`Current ${goal.metric || 'value'}`}
                      placeholderTextColor={Colors.textLight}
                    />
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveProgress}
                >
                  <Save size={18} color="#fff" />
                  <Text style={styles.saveButtonText}>Save Progress</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        {!goal.completed && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompleteGoal}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  typeTag: {
    backgroundColor: Colors.primary + '20', // 20% opacity
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 24,
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
  overdue: {
    color: Colors.danger,
  },
  urgent: {
    color: Colors.warning,
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
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  progressDetails: {
    flex: 1,
    marginLeft: 16,
  },
  progressDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  progressDetailLabel: {
    fontSize: 16,
    color: Colors.textLight,
    width: 70,
  },
  progressDetailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  editProgressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 8,
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