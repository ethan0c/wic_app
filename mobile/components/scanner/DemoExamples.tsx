import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from '../Typography';
import SectionCard from '../home/SectionCard';
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
  reasons: string[];
  alternatives: Array<{
    upc: string;
    suggestion: string;
    reason: string;
  }>;
};

interface DemoExamplesProps {
  onProductSelect: (product: Product) => void;
}

export default function DemoExamples({ onProductSelect }: DemoExamplesProps) {
  const lookupProduct = (upc: string): Product | null => {
    return aplData.products.find((p: Product) => p.upc === upc) || null;
  };

  const handleDemoPress = (upc: string) => {
    const product = lookupProduct(upc);
    if (product) {
      onProductSelect(product);
    }
  };

  return (
    <SectionCard title="🎯 Try Demo Examples">
      <View style={styles.demoGrid}>
        <TouchableOpacity
          style={[styles.demoButton, styles.notCoveredButton]}
          onPress={() => handleDemoPress("041303001813")} // Gallon milk
        >
          <Typography variant="caption" weight="600" style={{ color: '#EF4444', textAlign: 'center', marginBottom: 4 }}>
            🥛 Gallon Milk
          </Typography>
          <Typography variant="caption" style={{ color: '#EF4444', textAlign: 'center', fontSize: 10 }}>
            Not covered → See why
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.demoButton, styles.approvedButton]}
          onPress={() => handleDemoPress("041303001806")} // Half-gallon milk
        >
          <Typography variant="caption" weight="600" style={{ color: '#10B981', textAlign: 'center', marginBottom: 4 }}>
            🥛 ½ Gallon Milk
          </Typography>
          <Typography variant="caption" style={{ color: '#10B981', textAlign: 'center', fontSize: 10 }}>
            WIC Approved ✓
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.demoGrid}>
        <TouchableOpacity
          style={[styles.demoButton, styles.notCoveredButton]}
          onPress={() => handleDemoPress("072250015144")} // 20oz bread
        >
          <Typography variant="caption" weight="600" style={{ color: '#EF4444', textAlign: 'center', marginBottom: 4 }}>
            🍞 20oz Bread
          </Typography>
          <Typography variant="caption" style={{ color: '#EF4444', textAlign: 'center', fontSize: 10 }}>
            Wrong size → Alternative
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.demoButton, styles.approvedButton]}
          onPress={() => handleDemoPress("072250015137")} // 16oz bread
        >
          <Typography variant="caption" weight="600" style={{ color: '#10B981', textAlign: 'center', marginBottom: 4 }}>
            🍞 16oz Bread
          </Typography>
          <Typography variant="caption" style={{ color: '#10B981', textAlign: 'center', fontSize: 10 }}>
            WIC Approved ✓
          </Typography>
        </TouchableOpacity>
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