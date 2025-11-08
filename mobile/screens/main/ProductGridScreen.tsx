import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import aplData from '../../data/apl.json';
import * as Speech from 'expo-speech';

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

export default function ProductGridScreen({ route }: any) {
  const { categoryKey, categoryName, allowance, unit } = route.params;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [language, setLanguage] = useState<'en' | 'ht'>('en');

  const categoryProducts = aplData.products.filter((product: Product) => 
    product.category === categoryKey
  );

  const handleProductPress = (product: Product) => {
    (navigation as any).navigate('ProductDetail', { product, categoryName });
  };

  const speakText = (text: string) => {
    const voice = language === 'ht' ? 'ht-HT' : 'en-US';
    Speech.speak(text, { 
      language: voice,
      rate: 0.8,
      pitch: 1.0
    });
  };

  const handleScanPress = () => {
    (navigation as any).navigate('Scanner', { categoryKey });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Typography variant="heading">{categoryName}</Typography>
          <Typography variant="body" color="textSecondary">
            {allowance} {unit} allowed per month
          </Typography>
        </View>

        <TouchableOpacity 
          onPress={() => setLanguage(lang => lang === 'en' ? 'ht' : 'en')}
          style={[styles.langButton, { backgroundColor: theme.primary + '15' }]}
        >
          <Text style={[styles.langText, { color: theme.primary }]}>
            {language === 'en' ? 'EN' : 'HT'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionBar}>
        <Button 
          title="Scan Item" 
          onPress={handleScanPress}
          style={{ flex: 1, marginRight: 8 }}
          size="large"
        />
        <TouchableOpacity 
          style={[styles.audioButton, { backgroundColor: theme.primary }]}
          onPress={() => speakText(`Browse ${categoryName} products. Tap any item to see details.`)}
        >
          <Ionicons name="volume-high" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.productGrid}>
        {categoryProducts.map((product: Product) => (
          <TouchableOpacity
            key={product.upc}
            style={[styles.productCard, { 
              backgroundColor: theme.card, 
              borderColor: product.isApproved ? theme.primary + '30' : theme.error + '30',
              borderWidth: 2 
            }]}
            onPress={() => handleProductPress(product)}
            activeOpacity={0.7}
          >
            <View style={[styles.statusBadge, { 
              backgroundColor: product.isApproved ? '#10B981' : '#EF4444' 
            }]}>
              <Ionicons 
                name={product.isApproved ? "checkmark" : "close"} 
                size={16} 
                color="white" 
              />
            </View>
            
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={40} color={theme.textSecondary} />
            </View>
            
            <Typography variant="label" style={{ marginTop: 8 }}>
              {product.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {product.brand} • {product.size_display}
            </Typography>
            
            {!product.isApproved && product.alternatives.length > 0 && (
              <View style={[styles.altBadge, { backgroundColor: theme.primary + '15' }]}>
                <Typography variant="caption" style={{ color: theme.primary }}>
                  Alternative available
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerContent: { flex: 1, marginHorizontal: 16 },
  langButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  langText: { fontSize: 12, fontWeight: '600' },
  actionBar: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingBottom: 16,
    alignItems: 'center'
  },
  audioButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { flex: 1 },
  productGrid: { 
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  productCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  altBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
});