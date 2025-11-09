import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from '../Typography';
import SectionCard from '../home/SectionCard';
import { useLanguage } from '../../context/LanguageContext';
import { useWicCard } from '../../context/WicCardContext';
import { getUserBenefits } from '../../services/wicApi';
import aplData from '../../data/apl.json';

type Product = {
  upc: string;
  name: string;
  brand: string;
  category: string;
  size_oz: number;
  size_display: string;
  isApproved: boolean;
  image: string;
  imageFilename?: string;
  emoji?: string;
  reasons: string[];
  alternatives: Array<{
    upc: string;
    suggestion: string;
    reason: string;
    imageFilename?: string;
    emoji?: string;
  }>;
  benefitCalculation?: {
    category: string;
    currentRemaining: number;
    afterPurchase: number;
    unit: string;
    canAfford: boolean;
    maxQuantity?: number;
  } | null;
};

interface DemoExamplesProps {
  onProductSelect: (product: Product) => void;
}

export default function DemoExamples({ onProductSelect }: DemoExamplesProps) {
  const { t } = useLanguage();
  const { cardNumber } = useWicCard();
  const [benefits, setBenefits] = useState<any[]>([]);
  
  useEffect(() => {
    if (cardNumber) {
      loadBenefits();
    }
  }, [cardNumber]);

  const loadBenefits = async () => {
    if (!cardNumber) return;
    try {
      const benefitsData = await getUserBenefits(cardNumber);
      setBenefits(benefitsData);
    } catch (error) {
      console.error('Error loading benefits:', error);
    }
  };

  const calculateBenefitImpact = (product: any) => {
    if (!cardNumber || !product.isApproved) return null;
    
    // Find matching benefit category
    const benefit = benefits.find(b => 
      b.category.toLowerCase().includes(product.category.toLowerCase()) || 
      product.category.toLowerCase().includes(b.category.toLowerCase())
    );

    if (!benefit) return null;

    const currentRemaining = Number(benefit.remainingAmount);
    const productSize = product.size_oz;
    const afterPurchase = currentRemaining - productSize;
    const canAfford = afterPurchase >= 0;
    const maxQuantity = canAfford ? Math.floor(currentRemaining / productSize) : 0;

    return {
      category: benefit.category,
      currentRemaining,
      afterPurchase,
      unit: benefit.unit,
      canAfford,
      maxQuantity,
    };
  };
  
  const lookupProduct = (upc: string, demoEmoji?: string): Product | null => {
    const foundProduct = aplData.products.find((p: any) => p.upc === upc);
    if (!foundProduct) return null;

    // Add benefit calculation
    const benefitCalc = calculateBenefitImpact(foundProduct);
    
    return {
      ...foundProduct,
      emoji: demoEmoji, // Use demo emoji for visual display
      benefitCalculation: benefitCalc,
    };
  };

  const handleDemoPress = (upc: string, emoji?: string) => {
    const product = lookupProduct(upc, emoji);
    if (product) {
      onProductSelect(product);
    }
  };

  // 8 demo examples with variety
  const demoProducts = [
    { upc: "041303001806", emoji: "🥛", label: "½ Gal Milk", approved: true },
    { upc: "041303001813", emoji: "🥛", label: "1 Gal Milk", approved: false },
    { upc: "072250015137", emoji: "🍞", label: "16oz Bread", approved: true },
    { upc: "072250015144", emoji: "🍞", label: "20oz Bread", approved: false },
    { upc: "016000275218", emoji: "🥣", label: "Cheerios 18oz", approved: true },
    { upc: "016000275225", emoji: "🥣", label: "Cheerios 36oz", approved: true },
    { upc: "016000275232", emoji: "🥣", label: "Cheerios 48oz", approved: false },
    { upc: "072250015137", emoji: "🧀", label: "Cheese 16oz", approved: true }, // Reusing UPC as placeholder
  ];

  return (
    <SectionCard title={`🎯 ${t('scanner.demoExamples') || 'Try Demo Examples'}`}>
      {/* Row 1 */}
      <View style={styles.demoGrid}>
        {demoProducts.slice(0, 2).map((demo, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.demoButton, demo.approved ? styles.approvedButton : styles.notCoveredButton]}
            onPress={() => handleDemoPress(demo.upc, demo.emoji)}
          >
            <Typography variant="caption" weight="600" style={{ 
              color: demo.approved ? '#10B981' : '#EF4444', 
              textAlign: 'center', 
              marginBottom: 4 
            }}>
              {demo.emoji} {demo.label}
            </Typography>
            <Typography variant="caption" style={{ 
              color: demo.approved ? '#10B981' : '#EF4444', 
              textAlign: 'center', 
              fontSize: 10 
            }}>
              {demo.approved ? '✓' : '❌'}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 2 */}
      <View style={styles.demoGrid}>
        {demoProducts.slice(2, 4).map((demo, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.demoButton, demo.approved ? styles.approvedButton : styles.notCoveredButton]}
            onPress={() => handleDemoPress(demo.upc, demo.emoji)}
          >
            <Typography variant="caption" weight="600" style={{ 
              color: demo.approved ? '#10B981' : '#EF4444', 
              textAlign: 'center', 
              marginBottom: 4 
            }}>
              {demo.emoji} {demo.label}
            </Typography>
            <Typography variant="caption" style={{ 
              color: demo.approved ? '#10B981' : '#EF4444', 
              textAlign: 'center', 
              fontSize: 10 
            }}>
              {demo.approved ? '✓' : '❌'}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 3 */}
      <View style={styles.demoGrid}>
        {demoProducts.slice(4, 6).map((demo, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.demoButton, demo.approved ? styles.approvedButton : styles.notCoveredButton]}
            onPress={() => handleDemoPress(demo.upc, demo.emoji)}
          >
            <Typography variant="caption" weight="600" style={{ 
              color: demo.approved ? '#10B981' : '#EF4444', 
              textAlign: 'center', 
              marginBottom: 4 
            }}>
              {demo.emoji} {demo.label}
            </Typography>
            <Typography variant="caption" style={{ 
              color: demo.approved ? '#10B981' : '#EF4444', 
              textAlign: 'center', 
              fontSize: 10 
            }}>
              {demo.approved ? '✓' : '❌'}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 4 */}
      <View style={styles.demoGrid}>
        {demoProducts.slice(6, 8).map((demo, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.demoButton, demo.approved ? styles.approvedButton : styles.notCoveredButton]}
            onPress={() => handleDemoPress(demo.upc, demo.emoji)}
          >
            <Typography variant="caption" weight="600" style={{ 
              color: demo.approved ? '#10B981' : '#EF4444', 
              textAlign: 'center', 
              marginBottom: 4 
            }}>
              {demo.emoji} {demo.label}
            </Typography>
            <Typography variant="caption" style={{ 
              color: demo.approved ? '#10B981' : '#EF4444', 
              textAlign: 'center', 
              fontSize: 10 
            }}>
              {demo.approved ? '✓' : '❌'}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  demoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  demoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  notCoveredButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  approvedButton: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
});