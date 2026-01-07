import React from 'react';
import { Platform, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonIconProps {
  size?: number;
  color?: string;
}

/**
 * Custom hook that provides a back button icon with fallback for web platform
 * @returns A React component that renders the appropriate back icon
 */
export const useBackButton = () => {
  const BackButtonIcon: React.FC<BackButtonIconProps> = ({ 
    size = 24, 
    color = '#9b59b6' 
  }) => {
    // Check if we're on web platform
    if (Platform.OS === 'web') {
      // Use Unicode arrow character as fallback for web
      return (
        <Text style={[styles.webArrow, { fontSize: size, color: color }]}>
          ←
        </Text>
      );
    }

    // Use Ionicons for native platforms (iOS, Android)
    return <Ionicons name="arrow-back" size={size} color={color} />;
  };

  return BackButtonIcon;
};

const styles = StyleSheet.create({
  webArrow: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
