import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Animated } from 'react-native';
import { Home, Scan, List, Grid, Settings } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParamList } from './MainNavigator';

// Tab Screens
import HomeScreen from '../screens/main/HomeScreen';
import ScannerScreen from '../screens/main/ScannerScreen';
import BenefitsScreen from '../screens/main/BenefitsScreen';
import ExploreScreen from '../screens/main/ExploreScreen';

const Tab = createBottomTabNavigator();

type NavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function MainTabs() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;

          if (route.name === 'Home') {
            IconComponent = Home;
          } else if (route.name === 'Scanner') {
            IconComponent = Scan;
          } else if (route.name === 'Benefits') {
            IconComponent = List;
          } else if (route.name === 'Explore') {
            IconComponent = Grid;
          } else {
            IconComponent = Home;
          }

          // Add scale animation for focused tab icons
          const scale = focused ? 1.1 : 1;
          const activeStroke = '#1A1A1A';
          const inactiveStroke = theme.textSecondary;
          return (
            <Animated.View style={{ transform: [{ scale }] }}>
              <IconComponent
                size={size}
                color={focused ? activeStroke : inactiveStroke}
                stroke={focused ? activeStroke : inactiveStroke}
                fill="none"
              />
            </Animated.View>
          );
        },
        tabBarActiveTintColor: '#1A1A1A',
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontFamily: 'Canela_400Regular',
          fontWeight: '600',
          fontSize: 20,
        },
        headerShadowVisible: false,
        animationEnabled: true,
        animationTypeForReplace: 'push',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{ 
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Benefits" 
        component={BenefitsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
