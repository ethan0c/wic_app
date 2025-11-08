import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

export interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  buttonBackground: string;
  buttonText: string;
  cardBackground: string;
  error: string;
  success: string;
  primary: string;
  secondary: string;
  card: string;
  inputBackground: string;
}

// Sky blue and white color scheme
export const LIGHT_THEME: Theme = {
  background: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  buttonBackground: '#0EA5E9', // Sky blue
  buttonText: '#FFFFFF',
  cardBackground: '#F8FAFC',
  error: '#EF4444',
  success: '#10B981',
  primary: '#0EA5E9', // Sky blue
  secondary: '#38BDF8', // Lighter sky blue
  card: '#F8FAFC',
  inputBackground: '#FFFFFF',
};

export const DARK_THEME: Theme = {
  background: '#0F172A',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  buttonBackground: '#0EA5E9',
  buttonText: '#FFFFFF',
  cardBackground: '#1E293B',
  error: '#EF4444',
  success: '#10B981',
  primary: '#0EA5E9',
  secondary: '#38BDF8',
  card: '#1E293B',
  inputBackground: '#1E293B',
};

interface ThemeContextType {
  theme: Theme;
  themeKey: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useColorScheme();
  // Default to light mode
  const [themeKey, setThemeKey] = useState<'light' | 'dark'>('light');

  const theme = themeKey === 'dark' ? DARK_THEME : LIGHT_THEME;

  const toggleTheme = () => {
    setThemeKey(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, themeKey, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
