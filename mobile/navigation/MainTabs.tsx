import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Tab Screens
import HomeScreen from '../screens/main/HomeScreen';
import ScannerScreen from '../screens/main/ScannerScreen';
import BenefitsScreen from '../screens/main/BenefitsScreen';
import ExploreScreen from '../screens/main/ExploreScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Benefits') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'My WIC' }}
      />
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{ title: 'Scan Item' }}
      />
      <Tab.Screen 
        name="Benefits" 
        component={BenefitsScreen}
        options={{ title: 'My Benefits' }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ title: 'Explore' }}
      />
    </Tab.Navigator>
  );
}
