import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BORDER_RADIUS, FONT_WEIGHTS } from '../assets/styles/shared.styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.border;
    switch (variant) {
      case 'primary':
        return '#1A1A1A';
      case 'secondary':
        return theme.secondary;
      case 'outline':
        return 'transparent';
      default:
        return '#1A1A1A';
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textSecondary;
    if (variant === 'outline') return '#1A1A1A';
    return '#FFFFFF';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 12, paddingHorizontal: 20 };
      case 'medium':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      case 'large':
        return { paddingVertical: 18, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 16, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 17;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? '#1A1A1A' : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          ...getPadding(),
          width: fullWidth ? '100%' : undefined,
        },
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
