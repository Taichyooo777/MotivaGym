import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useWorkoutStore } from '@/store/workoutStore';
import Colors from '@/constants/colors';
import { Save } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function CreateGoalScreen() {
  const router = useRouter();
  const { addGoal } = useWorkoutStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [goalType, setGoalType] = useState<'strength' | 'endurance' | 'weight' | 'habit' | 'custom'>('strength');
  const [metric, setMetric] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const handleSaveGoal = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Validate
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }
    
    // Calculate initial progress
    let progress = 0;
    if (targetValue && currentValue) {
      const target = parseFloat(targetValue);
      const current = parseFloat(currentValue);
      if (target > 0 && current >= 0) {
        progress = Math.min(Math.round((current / target) * 100), 100);
      }
    }
    
    // Create goal object
    const goal = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      targetDate: targetDate || undefined,
      completed: false,
      progress,
      type: goalType,
      metric: metric.trim() || undefined,
      targetValue: targetValue ? parseFloat(targetValue) : undefined,
      currentValue: currentValue ? parseFloat(currentValue) : undefined,
    };
    
    // Add goal to store
    addGoal(goal);
    
    // Navigate back
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Create Goal',
          headerRight: () => (
            <TouchableOpacity onPress={handleSaveGoal}>
              <Save size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Bench Press 100kg"
            placeholderTextColor={Colors.textLight}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about your goal..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Target Date (Optional)</Text>
          <TextInput
            style={styles.input}
            value={targetDate}
            onChangeText={setTargetDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textLight}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Goal Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                goalType === 'strength' && styles.activeTypeButton,
              ]}
              onPress={() => setGoalType('strength')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  goalType === 'strength' && styles.activeTypeButtonText,
                ]}
              >
                Strength
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                goalType === 'endurance' && styles.activeTypeButton,
              ]}
              onPress={() => setGoalType('endurance')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  goalType === 'endurance' && styles.activeTypeButtonText,
                ]}
              >
                Endurance
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                goalType === 'weight' && styles.activeTypeButton,
              ]}
              onPress={() => setGoalType('weight')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  goalType === 'weight' && styles.activeTypeButtonText,
                ]}
              >
                Weight
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                goalType === 'habit' && styles.activeTypeButton,
              ]}
              onPress={() => setGoalType('habit')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  goalType === 'habit' && styles.activeTypeButtonText,
                ]}
              >
                Habit
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                goalType === 'custom' && styles.activeTypeButton,
              ]}
              onPress={() => setGoalType('custom')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  goalType === 'custom' && styles.activeTypeButtonText,
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Metric (Optional)</Text>
          <TextInput
            style={styles.input}
            value={metric}
            onChangeText={setMetric}
            placeholder="e.g., kg, reps, km, etc."
            placeholderTextColor={Colors.textLight}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Target Value (Optional)</Text>
          <TextInput
            style={styles.input}
            value={targetValue}
            onChangeText={setTargetValue}
            placeholder="e.g., 100"
            placeholderTextColor={Colors.textLight}
            keyboardType="decimal-pad"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Current Value (Optional)</Text>
          <TextInput
            style={styles.input}
            value={currentValue}
            onChangeText={setCurrentValue}
            placeholder="e.g., 75"
            placeholderTextColor={Colors.textLight}
            keyboardType="decimal-pad"
          />
        </View>
        
        {targetValue && currentValue && (
          <View style={styles.progressPreview}>
            <Text style={styles.progressLabel}>Initial Progress:</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${Math.min(Math.round((parseFloat(currentValue) / parseFloat(targetValue)) * 100), 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.min(Math.round((parseFloat(currentValue) / parseFloat(targetValue)) * 100), 100)}%
            </Text>
          </View>
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  textArea: {
    minHeight: 100,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  activeTypeButton: {
    backgroundColor: Colors.primary + '20', // 20% opacity
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  activeTypeButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  progressPreview: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.inactive,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'right',
  },
});