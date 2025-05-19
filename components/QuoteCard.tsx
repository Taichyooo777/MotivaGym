import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { RefreshCw } from 'lucide-react-native';

type QuoteCardProps = {
  quote: string;
  onRefresh: () => void;
};

export default function QuoteCard({ quote, onRefresh }: QuoteCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>"{quote}"</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={onRefresh}
        activeOpacity={0.7}
      >
        <RefreshCw size={16} color={Colors.primary} />
        <Text style={styles.refreshText}>New Quote</Text>
      </TouchableOpacity>
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
  quoteContainer: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 12,
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.text,
    lineHeight: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  refreshText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
});