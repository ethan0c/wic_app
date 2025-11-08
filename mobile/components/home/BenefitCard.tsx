import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../Typography';
import * as LucideIcons from 'lucide-react-native';

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

// Mapping from Ionicons to Lucide icons for better outline/fill control
const iconMapping: { [key: string]: keyof typeof LucideIcons } = {
  'water-outline': 'Droplets',      // Milk
  'nutrition-outline': 'Apple',      // Fruits & Veg
  'restaurant-outline': 'Wheat',     // Whole Grains (wheat icon)
  'cube-outline': 'Zap',            // Cereal (energy/lightning icon - could also be 'Battery' or 'Flame')
  'egg': 'Egg',                     // Protein
  'leaf': 'Wheat',                  // Alternative grains
  'fitness': 'Carrot',              // Vegetables
  'pizza': 'Cherry',                // Fruits
};

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
  // Generate darker border color from background color
  const getDarkerBorderColor = (bgColor: string) => {
    // Simple function to darken hex colors
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken by reducing each component by 40
    const newR = Math.max(0, r - 40);
    const newG = Math.max(0, g - 40);
    const newB = Math.max(0, b - 40);
    
    return `rgb(${newR}, ${newG}, ${newB})`;
  };

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
      style={[
        styles.card, 
        { 
          backgroundColor,
          borderColor: getDarkerBorderColor(backgroundColor)
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.benefitHeader}>
        {(() => {
          const lucideIconName = iconMapping[icon as string] || 'Package';
          const LucideIcon = LucideIcons[lucideIconName] as React.ComponentType<{
            size?: number;
            color?: string;
            fill?: string;
            stroke?: string;
            strokeWidth?: number;
          }>;
          
          return LucideIcon ? (
            <LucideIcon 
              size={24} 
              stroke="#1A1A1A" 
              fill="#FFFFFF" 
              strokeWidth={2}
            />
          ) : (
            <Ionicons name={icon} size={24} color={iconColor} />
          );
        })()}
        <Typography variant="title" weight="600" style={{ color: iconColor, fontSize: 16 }}>
          {title}
        </Typography>
      </View>
      
      <Typography variant="body" weight="700" style={{ color: iconColor, marginVertical: 8, fontSize: 20 }}>
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
