import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../Typography';
import BenefitCard from './BenefitCard';

type BenefitItem = {
  key: string;
  icon: any; // keyof typeof Ionicons.glyphMap, but avoid direct dependency here
  title: string;
  remaining: number;
  total: number;
  unit: string;
};

interface BenefitTilesGroupProps {
  items: BenefitItem[];
  onCardPress?: (key: string) => void;
}

const PASTEL_COLORS = ['#FFB5B5', '#B5FFB5', '#FFE5B5', '#E5B5FF'];

export default function BenefitTilesGroup({ items, onCardPress }: BenefitTilesGroupProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.cardBackground}>
        <View style={styles.header}>
          <Typography variant="title" weight="600">
            You Have Left This Month
          </Typography>
        </View>
        <View style={styles.grid}> 
          {items.map((item, idx) => (
            <BenefitCard
              key={item.key}
              icon={item.icon}
              title={item.title}
              remaining={item.remaining}
              total={item.total}
              unit={item.unit}
              backgroundColor={PASTEL_COLORS[idx % PASTEL_COLORS.length]}
              iconColor="#1A1A1A"
              onPress={onCardPress ? () => onCardPress(item.key) : undefined}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  cardBackground: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 0,
  },
  header: {
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
