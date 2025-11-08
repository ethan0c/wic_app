import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../Typography';

interface SmartPickItemProps {
  title: string;
  subtitle: string;
  status: 'eligible' | 'not-eligible';
}

export default function SmartPickItem({ title, subtitle, status }: SmartPickItemProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.smartPickCard, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.smartPickContent}>
        <View style={styles.smartPickText}>
          <Typography variant="title" weight="600" style={{ marginBottom: 2, fontSize: 16 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {subtitle}
          </Typography>
        </View>
        {status === 'eligible' && (
          <View style={[styles.eligibleBadge, { backgroundColor: '#10B98115' }]}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Typography variant="caption" style={{ color: '#10B981', marginLeft: 4 }}>
              Eligible
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  smartPickCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  smartPickContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smartPickText: {
    flex: 1,
  },
  eligibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
