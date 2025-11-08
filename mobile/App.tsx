import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WICProvider } from './context/WICContext';

// Auth Screens
import IntroScreen from './screens/auth/auth/IntroScreen';
import StateProviderScreen from './screens/auth/auth/StateProviderScreen';
import AuthIndexScreen from './screens/auth/auth/AuthIndexScreen';
import SignInScreen from './screens/auth/auth/SignInScreen';
import SignUpNameScreen from './screens/auth/auth/SignUpNameScreen';
import SignUpEmailScreen from './screens/auth/auth/SignUpEmailScreen';
import SignUpPasswordScreen from './screens/auth/auth/SignUpPasswordScreen';
import ForgotPasswordScreen from './screens/auth/auth/ForgotPasswordScreen';

// Main App Screens
import MainTabs from './navigation/MainTabs';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { themeKey, theme } = useTheme();

  // Show loading screen while checking for stored session
  if (isLoading) {
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
              <Stack.Screen name="AuthIndex" component={AuthIndexScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUpName" component={SignUpNameScreen} />
              <Stack.Screen name="SignUpEmail" component={SignUpEmailScreen} />
              <Stack.Screen name="SignUpPassword" component={SignUpPasswordScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          ) : (
            // Main App Stack
            <Stack.Screen name="MainTabs" component={MainTabs} />
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
          <AppNavigator />
        </WICProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
