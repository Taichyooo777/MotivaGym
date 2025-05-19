import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

type ProgressCircleProps = {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
};

export default function ProgressCircle({
  progress,
  size = 100,
  strokeWidth = 10,
  color = Colors.primary,
  backgroundColor = Colors.inactive,
  children,
}: ProgressCircleProps) {
  // Ensure progress is between 0-100
  const validProgress = Math.min(100, Math.max(0, progress));
  
  // Calculate radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (validProgress / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.backgroundCircle}>
        <View
          style={[
            styles.progressBackground,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: backgroundColor,
            },
          ]}
        />
        <View
          style={[
            styles.progressCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              transform: [{ rotateZ: '-90deg' }],
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              borderLeftColor: 'transparent',
              opacity: validProgress === 0 ? 0 : 1,
            },
            validProgress > 50 && styles.progressCircleOver50,
          ]}
        />
        {validProgress > 50 && (
          <View
            style={[
              styles.progressCircle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                transform: [{ rotateZ: '90deg' }],
                borderBottomColor: 'transparent',
                borderRightColor: 'transparent',
                borderLeftColor: 'transparent',
              },
            ]}
          />
        )}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBackground: {
    position: 'absolute',
  },
  progressCircle: {
    position: 'absolute',
  },
  progressCircleOver50: {
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});