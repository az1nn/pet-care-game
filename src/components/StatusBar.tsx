import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatusBarProps = {
  label: string;
  value: number;
  color: string;
  emoji: string;
};

export const StatusBar: React.FC<StatusBarProps> = ({
  label,
  value,
  color,
  emoji,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.barContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              { width: `${value}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
      <Text style={styles.value}>{Math.round(value)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  barContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  barBackground: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    width: 40,
    textAlign: 'right',
  },
});