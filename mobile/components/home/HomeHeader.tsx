import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../Typography';

interface HomeHeaderProps {
  userName?: string;
}

export default function HomeHeader({ userName = 'Maria' }: HomeHeaderProps) {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerRow}>
        <Typography variant="heading" weight="500" style={{ fontSize: 20 }}>
          Welcome back, {userName}!
        </Typography>
        <TouchableOpacity activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 0,
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
