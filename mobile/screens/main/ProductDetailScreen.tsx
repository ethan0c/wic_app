import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Vibration, Image as RNImage } from 'react-native';
import { ArrowLeft, Image, CheckCircle, XCircle, Volume2, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import aplData from '../../data/apl.json';
import * as Speech from 'expo-speech';
import { getImageSource } from '../../utils/imageHelper';

type Product = {
  upc: string;
  name: string;
  brand: string;
  category: string;
  size_oz: number;
  size_display: string;
  isApproved: boolean;
  image?: string;  // Optional fallback emoji/icon
  imageFilename?: string;
  imageUrl?: string;
  emoji?: string;
  reasons: string[];
  alternatives: Array<{
    upc: string;
    suggestion: string;
    reason: string;
    imageFilename?: string;
    imageUrl?: string;
    emoji?: string;
  }>;
};

export default function ProductDetailScreen({ route }: any) {
  const { product, categoryName }: { product: Product, categoryName: string } = route.params;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [language, setLanguage] = useState<'en' | 'ht'>('en');

  const speakProductInfo = () => {
    const status = product.isApproved ? "approved" : "not covered";
    const message = `${product.name} by ${product.brand}, ${product.size_display}. This item is ${status} by WIC.`;
    
    if (!product.isApproved && product.alternatives.length > 0) {
      const altMessage = ` ${product.alternatives[0].reason}. ${product.alternatives[0].suggestion}.`;
      Speech.speak(message + altMessage, { language: language === 'ht' ? 'ht-HT' : 'en-US' });
    } else {
      Speech.speak(message, { language: language === 'ht' ? 'ht-HT' : 'en-US' });
    }
  };

  const handleAlternativePress = (alternative: any) => {
    // Find the alternative product
    const altProduct = aplData.products.find((p: Product) => p.upc === alternative.upc);
    if (altProduct) {
      (navigation as any).replace('ProductDetail', { product: altProduct, categoryName });
      Vibration.vibrate(100);
      Alert.alert("Alternative Found", `Switched to: ${altProduct.name} ${altProduct.size_display}`);
    }
  };

  const getRuleMessage = () => {
    if (product.isApproved) return null;
    
    const categoryRules = (aplData.rules as any)[product.category];
    if (!categoryRules) return "Item not covered by WIC.";

    if (product.reasons.includes("package_size_not_allowed")) {
      return categoryRules.messages?.size_restriction?.en || "Package size not allowed.";
    }
    
    return "Item not covered by WIC.";
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        
        <TouchableOpacity 
          onPress={() => setLanguage(lang => lang === 'en' ? 'ht' : 'en')}
          style={[styles.langButton, { backgroundColor: theme.primary + '15' }]}
        >
          <Text style={[styles.langText, { color: theme.primary }]}>
            {language === 'en' ? 'EN' : 'HT'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Product Image */}
        <View style={[styles.productImage, { backgroundColor: theme.card }]}>
          {(() => {
            // Priority: 1. OpenFoodFacts image from API, 2. Local image, 3. Emoji fallback
            if (product.image) {
              return (
                <RNImage 
                  source={{ uri: product.image }}
                  style={styles.productImageContent}
                  resizeMode="contain"
                />
              );
            }
            
            const imageSource = getImageSource(product.imageFilename, product.imageUrl);
            
            if (imageSource.source) {
              return (
                <RNImage 
                  source={imageSource.source}
                  style={styles.productImageContent}
                  resizeMode="contain"
                />
              );
            }
            
            // Fallback to emoji or icon
            if (product.emoji) {
              return (
                <Text style={{ fontSize: 80 }}>
                  {product.emoji}
                </Text>
              );
            }
            
            return <Image size={80} color={theme.textSecondary} stroke={theme.textSecondary} />;
          })()}
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, { 
          backgroundColor: product.isApproved ? '#10B981' : '#EF4444',
        }]}>
          <View style={styles.statusHeader}>
            {product.isApproved ? (
              <CheckCircle size={32} color="white" stroke="white" />
            ) : (
              <XCircle size={32} color="white" stroke="white" />
            )}
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.statusTitle}>
                {product.isApproved ? "WIC Approved" : "Not Covered"}
              </Text>
              <Text style={styles.statusSubtitle}>
                {product.name} • {product.brand}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={speakProductInfo}
              style={styles.audioButton}
            >
              <Volume2 size={24} color="white" stroke="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Typography variant="label" style={{ marginBottom: 12 }}>Product Information</Typography>
          <View style={styles.infoRow}>
            <Typography variant="body" color="textSecondary">Brand:</Typography>
            <Typography variant="body">{product.brand}</Typography>
          </View>
          <View style={styles.infoRow}>
            <Typography variant="body" color="textSecondary">Size:</Typography>
            <Typography variant="body">
              {product.size_display}
              {product.size_oz > 0 && product.size_display && !product.size_display.includes('oz') && ` (${product.size_oz} oz)`}
            </Typography>
          </View>
          <View style={styles.infoRow}>
            <Typography variant="body" color="textSecondary">Category:</Typography>
            <Typography variant="body">{categoryName}</Typography>
          </View>
          <View style={styles.infoRow}>
            <Typography variant="body" color="textSecondary">UPC:</Typography>
            <Typography variant="body">{product.upc}</Typography>
          </View>
        </View>

        {/* Rule Explanation */}
        {!product.isApproved && (
          <View style={[styles.ruleCard, { backgroundColor: theme.card, borderLeftColor: '#EF4444' }]}>
            <Typography variant="label" style={{ marginBottom: 8, color: '#EF4444' }}>
              Why This Item Isn't Covered
            </Typography>
            <Typography variant="body" color="textSecondary">
              {getRuleMessage()}
            </Typography>
          </View>
        )}

        {/* Alternatives */}
        {product.alternatives.length > 0 && (
          <View style={[styles.alternativesCard, { backgroundColor: theme.card }]}>
            <Typography variant="label" style={{ marginBottom: 12 }}>
              Try This Instead
            </Typography>
            {product.alternatives.map((alt, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.alternativeItem, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}
                onPress={() => handleAlternativePress(alt)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Typography variant="body" style={{ color: theme.primary, fontWeight: '500' }}>
                    {alt.suggestion}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
                    {alt.reason}
                  </Typography>
                </View>
                <ArrowRight size={20} color={theme.primary} stroke={theme.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Scan Another Item"
            onPress={() => (navigation as any).navigate('Scanner')}
            fullWidth
            size="large"
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Browse More Products"
            onPress={() => navigation.goBack()}
            fullWidth
            size="large"
            variant="outline"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  langButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  langText: { fontSize: 12, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  productImage: {
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  productImageContent: {
    width: 180,
    height: 180,
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  statusSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 2,
  },
  audioButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ruleCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  alternativesCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  actions: {
    marginTop: 20,
  },
});