import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

// Tab Navigator
import MainTabs from './MainTabs';

// Additional Screens
import CategoriesScreen from '../screens/main/CategoriesScreen';
import ProductGridScreen from '../screens/main/ProductGridScreen';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';

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
};

const Stack = createStackNavigator<MainNavigatorParamList>();

export default function MainNavigator() {
  const { theme } = useTheme();

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
          fontFamily: 'PlayfairDisplay_400Regular',
          fontWeight: '600',
          fontSize: 20,
        },
        headerBackTitle: '',
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
    </Stack.Navigator>
  );
}