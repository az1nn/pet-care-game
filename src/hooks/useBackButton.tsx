import React from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonIconProps {
  size?: number;
  color?: string;
}

/**
 * Custom hook that provides a back button icon with fallback for web platform
 * @param size Icon size (default: 24)
 * @param color Icon color (default: '#9b59b6')
 * @returns A React component that renders the appropriate back icon
 */
export const useBackButton = (size: number = 24, color: string = '#9b59b6') => {
  const BackButtonIcon: React.FC<BackButtonIconProps> = ({ 
    size: propSize = size, 
    color: propColor = color 
  }) => {
    // Check if we're on web platform
    if (Platform.OS === 'web') {
      // Use Unicode arrow character as fallback for web
      return (
        <Text style={[styles.webArrow, { fontSize: propSize, color: propColor }]}>
          ←
        </Text>
      );
    }

    // Use Ionicons for native platforms (iOS, Android)
    try {
      return <Ionicons name="arrow-back" size={propSize} color={propColor} />;
    } catch (error) {
      // Fallback if Ionicons fails to load
      return (
        <Text style={[styles.webArrow, { fontSize: propSize, color: propColor }]}>
          ←
        </Text>
      );
    }
  };

  return BackButtonIcon;
};

const styles = StyleSheet.create({
  webArrow: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
