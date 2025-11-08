import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

          // Add scale animation for focused tab icons
          const scale = focused ? 1.1 : 1;
          return (
            <Animated.View style={{ transform: [{ scale }] }}>
              <Ionicons name={iconName} size={size} color={color} />
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
          title: 'Scan Item',
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 16,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('ScannerSettings')}
            >
              <MaterialCommunityIcons name="cog" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          )
        }}
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
