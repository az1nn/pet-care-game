import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { hapticFeedback } from '../utils/haptics';
import { useResponsive } from '../hooks/useResponsive';
import { ICON_BUTTON_SIZE } from '../config/responsive';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { audioService } from '../services/AudioService';

type IconButtonProps = {
  emoji: string;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  disabledReason?: string;
  soundEnabled?: boolean;
};

export const IconButton: React.FC<IconButtonProps> = React.memo(
  ({ emoji, label, onPress, style, disabled = false, disabledReason, soundEnabled = true }) => {
    const { deviceType, spacing } = useResponsive();
    const { showToast } = useToast();
    const { themeType } = useTheme();
    const sizes = ICON_BUTTON_SIZE[deviceType];

    const handlePress = () => {
      if (disabled) {
        if (disabledReason) {
          hapticFeedback.light();
          showToast(disabledReason, 'info');
        }
        return;
      }
      hapticFeedback.light();
      if (soundEnabled) {
        audioService.playSound('button_click');
      }
      onPress();
    };

    const dynamicStyles = {
      button: {
        minWidth: sizes.width,
        padding: sizes.padding,
        borderRadius: themeType === 'new' ? sizes.width / 2 : spacing(12),
        height: themeType === 'new' ? sizes.width : 'auto',
      },
      emoji: {
        fontSize: sizes.emoji,
      },
      label: {
        fontSize: sizes.label,
      },
    };

    // If disabled AND disabledReason is present, we want the button to be INTERACTIVE
    // so we can show the toast explaining why it's disabled.
    // If disabled AND NO disabledReason, it remains non-interactive.
    const isInteractive = !disabled || (disabled && !!disabledReason);

    return (
      <TouchableOpacity
        style={[styles.button, dynamicStyles.button, style, disabled && styles.disabled]}
        onPress={handlePress}
        disabled={!isInteractive}
        activeOpacity={disabled ? 1 : 0.7}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        accessibilityHint={disabledReason}
      >
        <Text style={[styles.emoji, dynamicStyles.emoji, themeType === 'new' && { marginBottom: 0 }]}>{emoji}</Text>
        {themeType !== 'new' && <Text style={[styles.label, dynamicStyles.label]}>{label}</Text>}
      </TouchableOpacity>
    );
  }
);

IconButton.displayName = 'IconButton';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  emoji: {
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
