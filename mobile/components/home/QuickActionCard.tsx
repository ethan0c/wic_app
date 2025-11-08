import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Typography from '../Typography';

interface QuickActionCardProps {
  Icon: React.ComponentType<any>;
  title: string;
  backgroundColor: string;
  iconColor: string;
  onPress?: () => void;
}

export default function QuickActionCard({
  Icon,
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
  <Icon size={28} color={iconColor} stroke={iconColor} />
      <Typography variant="caption" weight="600" style={{ color: '#1A1A1A', marginTop: 6 }}>
        {title}
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
