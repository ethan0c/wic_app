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
          fontWeight: 'normal' as const,
          letterSpacing: -0.5,
          fontFamily: weight === '700' ? 'Canela_700Bold' : weight === '500' ? 'Canela_500Medium' : 'Canela_400Regular',
        };
      case 'subheading':
        return {
          fontSize: 22,
          fontWeight: 'normal' as const,
          fontFamily: weight === '700' ? 'Canela_700Bold' : weight === '500' ? 'Canela_500Medium' : 'Canela_400Regular',
        };
      case 'title':
        return {
          fontSize: 20,
          fontWeight: 'normal' as const,
          fontFamily: weight === '700' ? 'Canela_700Bold' : weight === '500' ? 'Canela_500Medium' : 'Canela_400Regular',
        };
      case 'body':
        return {
          fontSize: 16,
          fontWeight: 'normal' as const,
          lineHeight: 24,
          fontFamily: weight === '700' ? 'Inter_700Bold' : weight === '600' ? 'Inter_600SemiBold' : weight === '500' ? 'Inter_500Medium' : weight === '300' ? 'Inter_300Light' : 'Inter_400Regular',
        };
      case 'label':
        return {
          fontSize: 14,
          fontWeight: 'normal' as const,
          fontFamily: weight === '700' ? 'Inter_700Bold' : weight === '600' ? 'Inter_600SemiBold' : weight === '500' ? 'Inter_500Medium' : weight === '300' ? 'Inter_300Light' : 'Inter_400Regular',
        };
      case 'caption':
        return {
          fontSize: 12,
          fontWeight: 'normal' as const,
          fontFamily: weight === '700' ? 'Inter_700Bold' : weight === '600' ? 'Inter_600SemiBold' : weight === '500' ? 'Inter_500Medium' : weight === '300' ? 'Inter_300Light' : 'Inter_400Regular',
        };
      default:
        return {
          fontSize: 16,
          fontWeight: 'normal' as const,
          fontFamily: weight === '700' ? 'Inter_700Bold' : weight === '600' ? 'Inter_600SemiBold' : weight === '500' ? 'Inter_500Medium' : weight === '300' ? 'Inter_300Light' : 'Inter_400Regular',
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
