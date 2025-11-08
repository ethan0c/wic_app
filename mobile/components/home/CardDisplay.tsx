import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../Typography';

interface CardDisplayProps {
  cardNumber?: string;
  onPress?: () => void;
}

export default function CardDisplay({ cardNumber = '4829', onPress }: CardDisplayProps) {
  return (
    <TouchableOpacity style={styles.cardInfo} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.cardLeft}>
        <Ionicons name="card-outline" size={16} color="#1A1A1A" />
        <Typography variant="caption" style={{ color: '#1A1A1A', marginLeft: 6 }}>
          Card ending in {cardNumber}
        </Typography>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#1A1A1A" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});