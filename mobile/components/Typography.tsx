import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONT_WEIGHTS } from '../assets/styles/shared.styles';

interface TypographyProps extends TextProps {
  children: ReactNode;
  variant?: 'heading' | 'subheading' | 'title' | 'body' | 'label' | 'caption';
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'error' | 'success';
  align?: 'left' | 'center' | 'right';
  weight?: '300' | '400' | '500' | '600' | '700';
}

export default function Typography({
  children,
  variant = 'body',
  color = 'text',
  align = 'left',
  weight,
  style,
  ...props
}: TypographyProps) {
  const { theme } = useTheme();

  const getTextStyle = () => {
    switch (variant) {
      case 'heading':
        return {
          fontSize: 28,
          fontWeight: weight || FONT_WEIGHTS.bold,
          letterSpacing: -0.5,
          fontFamily: 'PlayfairDisplay_400Regular',
        };
      case 'subheading':
        return {
          fontSize: 22,
          fontWeight: weight || FONT_WEIGHTS.bold,
          fontFamily: 'PlayfairDisplay_400Regular',
        };
      case 'title':
        return {
          fontSize: 20,
          fontWeight: weight || FONT_WEIGHTS.bold,
          fontFamily: 'PlayfairDisplay_400Regular',
        };
      case 'body':
        return {
          fontSize: 16,
          fontWeight: weight || FONT_WEIGHTS.light,
          lineHeight: 24,
          fontFamily: 'SF Pro Text',
        };
      case 'label':
        return {
          fontSize: 14,
          fontWeight: weight || FONT_WEIGHTS.medium,
          fontFamily: 'SF Pro Text',
        };
      case 'caption':
        return {
          fontSize: 12,
          fontWeight: weight || FONT_WEIGHTS.light,
          fontFamily: 'SF Pro Text',
        };
      default:
        return {
          fontSize: 16,
          fontWeight: weight || FONT_WEIGHTS.light,
          fontFamily: 'SF Pro Text',
        };
    }
  };

  const getColor = () => {
    switch (color) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'text':
        return theme.text;
      case 'textSecondary':
        return theme.textSecondary;
      case 'error':
        return theme.error;
      case 'success':
        return theme.success;
      default:
        return theme.text;
    }
  };

  return (
    <Text
      style={[
        getTextStyle(),
        {
          color: getColor(),
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
