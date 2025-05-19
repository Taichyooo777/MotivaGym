import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/colors';
import { Home, Dumbbell, Target, User } from 'lucide-react-native';
import { useLanguageStore } from '@/store/languageStore';

export default function TabLayout() {
  const { t } = useLanguageStore();

  const tabOptions = {
    tabBarActiveTintColor: Colors.primary,
    tabBarInactiveTintColor: Colors.inactive,
    tabBarStyle: {
      backgroundColor: Colors.card,
      borderTopColor: Colors.separator,
    },
    headerStyle: {
      backgroundColor: Colors.card,
    },
    headerTitleStyle: {
      color: Colors.text,
      fontWeight: '600' as const,
    },
    tabBarLabelStyle: {
      fontSize: 12,
    },
  };

  return (
    <Tabs screenOptions={tabOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: t('tabs.workouts'),
          tabBarLabel: t('tabs.workouts'),
          tabBarIcon: ({ color, size }) => (
            <Dumbbell size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: t('tabs.goals'),
          tabBarLabel: t('tabs.goals'),
          tabBarIcon: ({ color, size }) => (
            <Target size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}