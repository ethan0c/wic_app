import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../Typography';

interface QuickActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  backgroundColor: string;
  iconColor: string;
  onPress?: () => void;
}

export default function QuickActionCard({
  icon,
  title,
  backgroundColor,
  iconColor,
  onPress,
}: QuickActionCardProps) {
  return (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={32} color={iconColor} />
      <Typography variant="body" weight="600" style={{ color: iconColor, marginTop: 8 }}>
        {title}
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
