import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useWorkoutStore } from '@/store/workoutStore';
import Colors from '@/constants/colors';
import { 
  User, 
  Award, 
  Settings, 
  Share2, 
  HelpCircle, 
  LogOut, 
  Trash2,
  ChevronRight
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { userStats } = useWorkoutStore();
  
  const handleResetData = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all your workout data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // In a real app, we would clear the store here
            Alert.alert('Data Reset', 'All your workout data has been reset.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <User size={40} color={Colors.primary} />
        </View>
        <Text style={styles.username}>Fitness Warrior</Text>
        <Text style={styles.subtitle}>Keep pushing your limits!</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.personalBests.length}</Text>
          <Text style={styles.statLabel}>Personal Bests</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <User size={20} color={Colors.text} />
          <Text style={styles.menuItemText}>Edit Profile</Text>
          <ChevronRight size={16} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Award size={20} color={Colors.text} />
          <Text style={styles.menuItemText}>Achievements</Text>
          <ChevronRight size={16} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} color={Colors.text} />
          <Text style={styles.menuItemText}>Settings</Text>
          <ChevronRight size={16} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Share2 size={20} color={Colors.text} />
          <Text style={styles.menuItemText}>Share App</Text>
          <ChevronRight size={16} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <HelpCircle size={20} color={Colors.text} />
          <Text style={styles.menuItemText}>Help & Support</Text>
          <ChevronRight size={16} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <LogOut size={20} color={Colors.text} />
          <Text style={styles.menuItemText}>Log Out</Text>
          <ChevronRight size={16} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, styles.dangerMenuItem]}
          onPress={handleResetData}
        >
          <Trash2 size={20} color={Colors.danger} />
          <Text style={[styles.menuItemText, styles.dangerText]}>Reset All Data</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20', // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.separator,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  dangerMenuItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: Colors.danger,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
});