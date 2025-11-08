import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BORDER_RADIUS, SPACING } from '../assets/styles/shared.styles';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export default function Card({
  children,
  variant = 'default',
  padding = 'medium',
  style,
  ...props
}: CardProps) {
  const { theme } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return SPACING.md;
      case 'medium':
        return SPACING.lg;
      case 'large':
        return SPACING.xl;
      default:
        return SPACING.lg;
    }
  };

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: theme.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: getPadding(),
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...styles.elevated,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.border,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
});
