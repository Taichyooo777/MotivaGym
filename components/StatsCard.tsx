import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { UserStats } from '@/types/workout';
import { Flame, Calendar, Award, TrendingUp } from 'lucide-react-native';

type StatsCardProps = {
  stats: UserStats;
};

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.streakIcon]}>
            <Flame size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.totalIcon]}>
            <Award size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.weekIcon]}>
            <Calendar size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.statValue}>{stats.thisWeekWorkouts}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.monthIcon]}>
            <TrendingUp size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.statValue}>{stats.thisMonthWorkouts}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  streakIcon: {
    backgroundColor: Colors.warning,
  },
  totalIcon: {
    backgroundColor: Colors.primary,
  },
  weekIcon: {
    backgroundColor: Colors.success,
  },
  monthIcon: {
    backgroundColor: Colors.secondary,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
});