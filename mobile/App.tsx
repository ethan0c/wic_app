import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WICProvider } from './context/WICContext';
import { ScannerSettingsProvider } from './context/ScannerSettingsContext';

// Auth Screens
import IntroScreen from './screens/auth/IntroScreen';
import StateProviderScreen from './screens/auth/StateProviderScreen';
import CardScanScreen from './screens/auth/CardScanScreen';
import AuthIndexScreen from './screens/auth/AuthIndexScreen';

// Main App Navigation
import MainNavigator from './navigation/MainNavigator';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { themeKey, theme } = useTheme();

  // Load Google Fonts
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
  });

  // Show loading screen while checking for stored session or loading fonts
  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={themeKey === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            // Auth Stack
            <>
              <Stack.Screen name="Intro" component={IntroScreen} />
              <Stack.Screen name="StateProvider" component={StateProviderScreen} />
              <Stack.Screen name="CardScan" component={CardScanScreen} />
              <Stack.Screen name="AuthIndex" component={AuthIndexScreen} />
            </>
          ) : (
            // Main App Stack
            <Stack.Screen name="MainApp" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WICProvider>
          <ScannerSettingsProvider>
            <AppNavigator />
          </ScannerSettingsProvider>
        </WICProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
