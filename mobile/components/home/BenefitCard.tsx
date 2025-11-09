import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../Typography';
import { useLanguage } from '../../context/LanguageContext';
import * as LucideIcons from 'lucide-react-native';

interface BenefitCardProps {
  Icon: React.ComponentType<any>;
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
  'egg': 'CircleDot',               // Protein (Lucide doesn't have an Egg icon, using CircleDot as alternative)
  'leaf': 'Wheat',                  // Alternative grains
  'fitness': 'Carrot',              // Vegetables
  'pizza': 'Cherry',                // Fruits
};

export default function BenefitCard({
  Icon,
  title,
  remaining,
  total,
  unit,
  backgroundColor,
  iconColor,
  onPress,
}: BenefitCardProps) {
  const { t } = useLanguage();
  
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
    const remainingPercentage = (remaining / total) * 100;

    return (
      <View style={styles.progressContainer}>
        {/* Green portion - remaining/available */}
        <View
          style={[
            styles.progressFill,
            {
              width: `${remainingPercentage}%`,
              backgroundColor: '#10B981',
            },
          ]}
        />
        {/* Red portion - used */}
        <View
          style={[
            styles.progressFill,
            {
              width: `${100 - remainingPercentage}%`,
              backgroundColor: '#EF4444',
            },
          ]}
        />
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
          // Icon is already a Lucide component, render directly
          return (
            <Icon 
              size={24} 
              stroke="#1A1A1A" 
              fill="#FFFFFF" 
              strokeWidth={1}
            />
          );
        })()}
        <Typography variant="title" weight="600" style={{ color: iconColor, fontSize: 16 }}>
          {title}
        </Typography>
      </View>
      
      <Typography variant="caption" style={{ color: iconColor, opacity: 0.8, marginTop: 12, marginBottom: 4 }}>
        {t('home.available')}
      </Typography>
      <Typography variant="body" weight="700" style={{ color: iconColor, fontSize: 20 }}>
        {unit === 'dollars' ? `$${remaining.toFixed(2)}` : remaining} {unit === 'dollars' ? '' : unit}
      </Typography>
      
      {renderProgressBar()}
      
      <Typography variant="caption" style={{ color: iconColor, opacity: 0.8, marginTop: 4 }}>
        of {unit === 'dollars' ? `$${total.toFixed(2)}` : `${total} ${unit}`} {t('home.total')}
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
    height: 3,
    backgroundColor: 'transparent',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginVertical: 8,
    flexDirection: 'row',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
});
