import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { Easing } from 'react-native';

// Tab Navigator
import MainTabs from './MainTabs';

// Additional Screens
import CategoriesScreen from '../screens/main/CategoriesScreen';
import ProductGridScreen from '../screens/main/ProductGridScreen';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import ScannerSettingsScreen from '../screens/settings/ScannerSettingsScreen';

export type MainNavigatorParamList = {
  MainTabs: undefined;
  Categories: undefined;
  ProductGrid: {
    categoryKey: string;
    categoryName: string;
  };
  ProductDetail: {
    product: any;
    categoryName: string;
  };
  Notifications: undefined;
  ScannerSettings: undefined;
};

const Stack = createStackNavigator<MainNavigatorParamList>();

export default function MainNavigator() {
  const { theme } = useTheme();

  // Custom smooth transition configuration
  const customTransition = {
    gestureEnabled: true,
    gestureDirection: 'horizontal' as const,
    transitionSpec: {
      open: {
        animation: 'timing' as const,
        config: {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        },
      },
      close: {
        animation: 'timing' as const,
        config: {
          duration: 250,
          easing: Easing.in(Easing.cubic),
        },
      },
    },
    cardStyleInterpolator: ({ current, next, layouts }: any) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
            {
              scale: next
                ? next.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.95],
                  })
                : 1,
            },
          ],
          opacity: current.progress.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [0, 0.5, 1],
          }),
        },
        overlayStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.1],
          }),
        },
      };
    },
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontFamily: 'Canela_400Regular',
          fontWeight: '600',
          fontSize: 20,
        },
        headerBackTitle: '',
        ...customTransition,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{ 
          title: 'WIC Food Categories',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="ProductGrid" 
        component={ProductGridScreen}
        options={({ route }) => ({
          title: route.params.categoryName,
          headerShown: true,
        })}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          title: 'Product Details',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="ScannerSettings" 
        component={ScannerSettingsScreen}
        options={{
          title: 'Scanner Settings',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}