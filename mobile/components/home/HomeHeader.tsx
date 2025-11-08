import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Typography from '../Typography';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';

interface HomeHeaderProps {
  userName?: string;
}

type NavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function HomeHeader({ userName = 'Maria' }: HomeHeaderProps) {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerRow}>
        <Typography variant="heading" weight="500" style={{ fontSize: 20 }}>
          Welcome back, {userName}!
        </Typography>
        <TouchableOpacity 
          activeOpacity={0.7} 
          accessibilityRole="button" 
          accessibilityLabel="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        >
          <Bell size={24} color="#1A1A1A" stroke="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginTop: 12,
  },
});
