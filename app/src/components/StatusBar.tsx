import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { STATUS_BAR_SIZE } from '../config/responsive';
import { useTheme } from '../context/ThemeContext';

type StatusBarProps = {
  label: string;
  value: number;
  color: string;
  emoji: string;
  showPercentage?: boolean;
  type?: 'hunger' | 'hygiene' | 'energy' | 'happiness' | 'health';
};

export const StatusBar: React.FC<StatusBarProps> = ({
  label,
  value,
  color,
  emoji,
  showPercentage = true,
  type,
}) => {
  const { deviceType, spacing } = useResponsive();
  const { colors, themeType } = useTheme();
  const sizes = STATUS_BAR_SIZE[deviceType];

  const dynamicStyles = {
    container: {
      marginVertical: spacing(2),
      paddingHorizontal: spacing(2),
    },
    emoji: {
      fontSize: sizes.emojiSize,
      marginRight: spacing(3),
    },
    label: {
      fontSize: sizes.fontSize,
      marginBottom: spacing(1),
    },
    barBackground: {
      height: sizes.barHeight,
      borderRadius: sizes.barHeight / 2,
    },
    barFill: {
      borderRadius: sizes.barHeight / 2,
    },
    value: {
      fontSize: sizes.fontSize,
      marginLeft: spacing(4),
      width: spacing(28),
    },
  };

  return (
    <View
      style={[styles.container, dynamicStyles.container]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: value }}
    >
      <Text style={[styles.emoji, dynamicStyles.emoji]}>{emoji}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.barBackground, dynamicStyles.barBackground, themeType === 'new' && { backgroundColor: colors.stats.background }]}>
          <View
            style={[
              styles.barFill,
              dynamicStyles.barFill,
              {
                width: `${value}%`,
                backgroundColor: themeType === 'new' ? (
                  type === 'hunger' ? colors.stats.hunger :
                  type === 'hygiene' ? colors.stats.hygiene :
                  type === 'energy' ? colors.stats.energy :
                  type === 'happiness' ? colors.stats.happiness :
                  colors.stats.health
                ) : color
              },
            ]}
          />
        </View>
      </View>
      {showPercentage && (
        <Text style={[styles.value, dynamicStyles.value]}>{Math.round(value)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {},
  barContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
    color: '#666',
  },
  barBackground: {
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  value: {
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
});
