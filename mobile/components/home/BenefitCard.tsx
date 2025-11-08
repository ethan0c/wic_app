import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../Typography';

interface BenefitCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  remaining: number;
  total: number;
  unit: string;
  backgroundColor: string;
  iconColor: string;
  onPress?: () => void;
}

export default function BenefitCard({
  icon,
  title,
  remaining,
  total,
  unit,
  backgroundColor,
  iconColor,
  onPress,
}: BenefitCardProps) {
  const renderProgressBar = () => {
    const usedPercentage = ((total - remaining) / total) * 100;
    const segments = Array.from({ length: 9 }, (_, i) => {
      const segmentPercentage = ((i + 1) / 9) * 100;
      return segmentPercentage <= (100 - usedPercentage);
    });

    return (
      <View style={styles.progressContainer}>
        {segments.map((filled, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              {
                backgroundColor: filled ? '#1A1A1A' : 'rgba(0,0,0,0.15)',
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.benefitHeader}>
        <Ionicons name={icon} size={24} color={iconColor} />
        <Typography variant="body" weight="600" style={{ color: iconColor }}>
          {title}
        </Typography>
      </View>
      
      <Typography variant="title" weight="700" style={{ color: iconColor, marginVertical: 8 }}>
        {unit === 'dollars' ? `$${remaining.toFixed(2)}` : remaining} {unit === 'dollars' ? '' : unit}
      </Typography>
      
      {renderProgressBar()}
      
      <Typography variant="caption" style={{ color: iconColor, opacity: 0.8, marginTop: 4 }}>
        of {unit === 'dollars' ? `$${total.toFixed(2)}` : `${total} ${unit}`}
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});
