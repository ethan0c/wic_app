import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { TransitionPresets } from '@react-navigation/stack';
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

  // Load Custom Fonts
  const [fontsLoaded] = useFonts({
    'Canela_400Regular': require('./assets/fonts/Canela_Collection/Canela Family/Canela-Regular-Trial.otf'),
    'Canela_500Medium': require('./assets/fonts/Canela_Collection/Canela Family/Canela-Medium-Trial.otf'),
    'Canela_700Bold': require('./assets/fonts/Canela_Collection/Canela Family/Canela-Bold-Trial.otf'),
    'Inter_300Light': require('./assets/fonts/inter/Inter-Light-BETA.otf'),
    'Inter_400Regular': require('./assets/fonts/inter/Inter-Regular.otf'),
    'Inter_500Medium': require('./assets/fonts/inter/Inter-Medium.otf'),
    'Inter_600SemiBold': require('./assets/fonts/inter/Inter-SemiBold.otf'),
    'Inter_700Bold': require('./assets/fonts/inter/Inter-Bold.otf'),
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
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: true,
          }}
        >
          {!isAuthenticated ? (
            // Auth Stack
            <>
              <Stack.Screen 
                name="Intro" 
                component={IntroScreen}
                options={{
                  ...TransitionPresets.FadeFromBottomAndroid,
                }}
              />
              <Stack.Screen 
                name="StateProvider" 
                component={StateProviderScreen}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
              <Stack.Screen 
                name="CardScan" 
                component={CardScanScreen}
                options={{
                  ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
              />
              <Stack.Screen 
                name="AuthIndex" 
                component={AuthIndexScreen}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
            </>
          ) : (
            // Main App Stack
            <Stack.Screen 
              name="MainApp" 
              component={MainNavigator}
              options={{
                ...TransitionPresets.FadeFromBottomAndroid,
              }}
            />
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
