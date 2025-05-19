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
import { exercises } from '@/constants/exercises';
import { Plus, Minus, Save, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const { addWorkout } = useWorkoutStore();
  
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<{
    exerciseId: string;
    sets: { id: string; reps: string; weight: string; }[];
  }[]>([]);

  const handleAddExercise = (exerciseId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Check if exercise is already added
    if (selectedExercises.some(e => e.exerciseId === exerciseId)) {
      return;
    }
    
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId,
        sets: [
          { id: Date.now().toString(), reps: '10', weight: '0' }
        ]
      }
    ]);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setSelectedExercises(selectedExercises.filter(e => e.exerciseId !== exerciseId));
  };

  const handleAddSet = (exerciseId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedExercises(selectedExercises.map(e => {
      if (e.exerciseId === exerciseId) {
        return {
          ...e,
          sets: [
            ...e.sets,
            { id: Date.now().toString(), reps: '10', weight: '0' }
          ]
        };
      }
      return e;
    }));
  };

  const handleRemoveSet = (exerciseId: string, setId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedExercises(selectedExercises.map(e => {
      if (e.exerciseId === exerciseId) {
        return {
          ...e,
          sets: e.sets.filter(s => s.id !== setId)
        };
      }
      return e;
    }));
  };

  const handleUpdateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => {
    setSelectedExercises(selectedExercises.map(e => {
      if (e.exerciseId === exerciseId) {
        return {
          ...e,
          sets: e.sets.map(s => {
            if (s.id === setId) {
              return { ...s, [field]: value };
            }
            return s;
          })
        };
      }
      return e;
    }));
  };

  const handleSaveWorkout = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Validate
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }
    
    if (selectedExercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }
    
    // Create workout object
    const workout = {
      id: Date.now().toString(),
      name: name.trim(),
      date,
      notes: notes.trim(),
      exercises: selectedExercises.map(e => ({
        exerciseId: e.exerciseId,
        sets: e.sets.map(s => ({
          id: s.id,
          exerciseId: e.exerciseId,
          reps: parseInt(s.reps) || 0,
          weight: parseFloat(s.weight) || 0,
          completed: false
        }))
      })),
      completed: false
    };
    
    // Add workout to store
    addWorkout(workout);
    
    // Navigate back
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Create Workout',
          headerRight: () => (
            <TouchableOpacity onPress={handleSaveWorkout}>
              <Save size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Workout Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Upper Body Strength"
            placeholderTextColor={Colors.textLight}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textLight}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any notes about this workout..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {selectedExercises.length > 0 ? (
            selectedExercises.map(exercise => {
              const exerciseData = exercises.find(e => e.id === exercise.exerciseId);
              
              return (
                <View key={exercise.exerciseId} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>{exerciseData?.name}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveExercise(exercise.exerciseId)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <X size={20} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.setsHeader}>
                    <Text style={styles.setsHeaderText}>Set</Text>
                    <Text style={styles.setsHeaderText}>Reps</Text>
                    <Text style={styles.setsHeaderText}>Weight (kg)</Text>
                    <Text style={styles.setsHeaderText}></Text>
                  </View>
                  
                  {exercise.sets.map((set, index) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text style={styles.setNumber}>{index + 1}</Text>
                      
                      <TextInput
                        style={styles.setInput}
                        value={set.reps}
                        onChangeText={(value) => handleUpdateSet(exercise.exerciseId, set.id, 'reps', value)}
                        keyboardType="number-pad"
                      />
                      
                      <TextInput
                        style={styles.setInput}
                        value={set.weight}
                        onChangeText={(value) => handleUpdateSet(exercise.exerciseId, set.id, 'weight', value)}
                        keyboardType="decimal-pad"
                      />
                      
                      <TouchableOpacity 
                        onPress={() => handleRemoveSet(exercise.exerciseId, set.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.removeSetButton}
                      >
                        <Minus size={16} color={Colors.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  
                  <TouchableOpacity 
                    style={styles.addSetButton}
                    onPress={() => handleAddSet(exercise.exerciseId)}
                  >
                    <Plus size={16} color={Colors.primary} />
                    <Text style={styles.addSetText}>Add Set</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyExercises}>
              <Text style={styles.emptyExercisesText}>
                No exercises added yet. Add some from the list below.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.exerciseListSection}>
          <Text style={styles.sectionTitle}>Available Exercises</Text>
          
          {exercises.map(exercise => (
            <TouchableOpacity
              key={exercise.id}
              style={[
                styles.exerciseListItem,
                selectedExercises.some(e => e.exerciseId === exercise.id) && styles.selectedExerciseItem
              ]}
              onPress={() => handleAddExercise(exercise.id)}
              disabled={selectedExercises.some(e => e.exerciseId === exercise.id)}
            >
              <View>
                <Text style={styles.exerciseListName}>{exercise.name}</Text>
                <Text style={styles.exerciseListCategory}>{exercise.category} • {exercise.muscleGroups.join(', ')}</Text>
              </View>
              
              {selectedExercises.some(e => e.exerciseId === exercise.id) ? (
                <Text style={styles.addedText}>Added</Text>
              ) : (
                <Plus size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  exercisesSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  emptyExercises: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.separator,
    borderStyle: 'dashed',
  },
  emptyExercisesText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  setsHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  setsHeaderText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    width: 30,
    textAlign: 'center',
  },
  setInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
    textAlign: 'center',
  },
  removeSetButton: {
    width: 30,
    alignItems: 'center',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.primary + '15', // 15% opacity
    borderRadius: 4,
  },
  addSetText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  exerciseListSection: {
    marginBottom: 24,
  },
  exerciseListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  selectedExerciseItem: {
    backgroundColor: Colors.primary + '10', // 10% opacity
    borderColor: Colors.primary + '30', // 30% opacity
  },
  exerciseListName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  exerciseListCategory: {
    fontSize: 14,
    color: Colors.textLight,
  },
  addedText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
});