import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import Typography from '../Typography';
import Button from '../Button';
import SectionCard from '../home/SectionCard';
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
  imageUrl?: string;  // Fallback URL if local image not available
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
  benefitCalculation?: {
    category: string;
    currentRemaining: number;
    afterPurchase: number;
    unit: string;
    canAfford: boolean;
    maxQuantity?: number;
  } | null;
};

interface ScanResultModalProps {
  visible: boolean;
  product: Product | null;
  language: 'en' | 'ht';
  onClose: () => void;
  onSpeakResult: () => void;
}

export default function ScanResultModal({
  visible,
  product,
  language,
  onClose,
  onSpeakResult,
}: ScanResultModalProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation();

  // Stop speech when modal closes
  useEffect(() => {
    if (!visible) {
      Speech.stop();
    }
  }, [visible]);

  const getCategoryEmoji = (category: string): string => {
    const categoryEmojis: { [key: string]: string } = {
      'milk': '🥛',
      'bread': '🍞',
      'cereal': '🥣',
      'cheese': '🧀',
      'eggs': '🥚',
      'fruits': '🍎',
      'vegetables': '🥕',
      'juice': '🧃',
      'peanut_butter': '🥜',
      'beans': '🫘',
      'fish': '🐟',
      'meat': '🥩',
    };
    return categoryEmojis[category] || '📦';
  };

  const getResultMessage = (product: Product): string => {
    if (product.isApproved) {
      return `${product.name} ${t('scanner.byBrand')} ${product.brand} (${product.size_display}) ${t('scanner.isApproved')}`;
    } else {
      // Product not found
      if (product.reasons.includes("product_not_found")) {
        return t('scanner.productNotFound');
      }
      
      // Not in WIC category at all
      if (product.reasons.includes("product_not_in_wic_category") || product.reasons.includes("notInWicCategory")) {
        return `${product.name} ${t('scanner.notInWicCategory')}.`;
      }
      
      // Wrong package size
      if (product.reasons.includes("package_size_not_allowed")) {
        const categoryRules = (aplData.rules as any)[product.category];
        
        // Milk - gallon not allowed
        if (product.category === "milk" && product.size_oz === 128) {
          return categoryRules?.messages?.size_restriction?.en || 
                 `${product.name} (${product.size_display}) ${t('scanner.productNotApproved')}. ${t('scanner.milkSizeRule')}`;
        }
        
        // Bread - must be exactly 16 oz
        if (product.category === "bread") {
          return categoryRules?.messages?.size_restriction?.en || 
                 `${product.name} (${product.size_display}) ${t('scanner.productNotApproved')}. ${t('scanner.breadSizeRule')}`;
        }
        
        // Generic size restriction
        return categoryRules?.messages?.size_restriction?.en || 
               `${product.name} (${product.size_display}) ${t('scanner.wrongSizeForWic')}.`;
      }
      
      // Exceeds monthly limit
      if (product.reasons.includes("exceeds_monthly_limit")) {
        const categoryRules = (aplData.rules as any)[product.category];
        
        if (product.category === "cereal") {
          return categoryRules?.messages?.size_restriction?.en || 
                 `${product.name} (${product.size_display}) ${t('scanner.cerealSizeRule')} ${t('scanner.chooseSmallerSize')}.`;
        }
        
        return `${product.name} (${product.size_display}) ${t('scanner.exceedsMonthlyAllowance')}.`;
      }
      
      // Brand not approved
      if (product.reasons.includes("brand_or_product_not_approved") || product.reasons.includes("brand_not_approved")) {
        return `${product.brand} ${product.name} ${t('scanner.notOnApprovedList')}.`;
      }
      
      // Generic fallback
      return `${product.name} ${t('scanner.byBrand')} ${product.brand} (${product.size_display}) ${t('scanner.notCovered')}`;
    }
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header Controls */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Typography variant="body" color="textSecondary">
                {t('common.close')}
              </Typography>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onSpeakResult}
              style={styles.audioButton}
            >
              <MaterialCommunityIcons name="volume-high" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
          {/* Result Status */}
          <View style={styles.resultHeader}>
            {/* Product Image or Emoji */}
            <View style={styles.productImageContainer}>
              {(() => {
                const imageSource = getImageSource(product.imageFilename, product.imageUrl);
                
                if (imageSource.source) {
                  return (
                    <Image 
                      source={imageSource.source}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  );
                }
                
                return (
                  <Typography variant="heading" style={{ fontSize: 48 }}>
                    {product.emoji || getCategoryEmoji(product.category)}
                  </Typography>
                );
              })()}
            </View>

            <View style={[
              styles.statusBadge,
              { backgroundColor: product.isApproved ? '#F0FDF4' : '#FEF2F2' }
            ]}>
              <Typography 
                variant="body" 
                weight="600"
                style={{ color: product.isApproved ? '#10B981' : '#EF4444' }}
              >
                {product.isApproved ? t('scanner.approved') : t('scanner.notApproved')}
              </Typography>
            </View>

            <Typography variant="subheading" weight="600" style={{ textAlign: 'center', marginTop: 12 }}>
              {product.name}
            </Typography>
            <Typography variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
              {product.brand} • {product.size_display}
            </Typography>
          </View>

          {/* Benefit Calculation - Before/After */}
          {product.benefitCalculation && product.isApproved && (
            <SectionCard style={{ marginBottom: 12, backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
              <View style={styles.benefitCalc}>
                <MaterialCommunityIcons name="calculator" size={24} color="#3B82F6" />
                <View style={styles.explanationText}>
                  <Typography variant="subheading" weight="600" style={{ marginBottom: 8, color: '#3B82F6' }}>
                    💰 {t('scanner.yourBalance')}
                  </Typography>
                  
                  {product.benefitCalculation.canAfford ? (
                    <>
                      <View style={styles.balanceRow}>
                        <Typography variant="body" color="textSecondary">{t('scanner.before')}</Typography>
                        <Typography variant="body" weight="600">
                          {product.benefitCalculation.currentRemaining} {product.benefitCalculation.unit}
                        </Typography>
                      </View>
                      <View style={styles.balanceRow}>
                        <Typography variant="body" color="textSecondary">{t('scanner.afterPurchase')}</Typography>
                        <Typography variant="body" weight="600" style={{ color: '#10B981' }}>
                          {product.benefitCalculation.afterPurchase} {product.benefitCalculation.unit} {t('scanner.remaining')}
                        </Typography>
                      </View>
                      {product.benefitCalculation.maxQuantity && product.benefitCalculation.maxQuantity > 1 && (
                        <Typography variant="caption" style={{ marginTop: 8, color: '#3B82F6' }}>
                          ✨ {t('scanner.canBuyUpTo')} {product.benefitCalculation.maxQuantity} {t('scanner.moreThisMonth')}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body" style={{ color: '#EF4444' }}>
                      ⚠️ {t('scanner.insufficientBalance')} {product.benefitCalculation.currentRemaining} {product.benefitCalculation.unit} {t('scanner.remaining')}.
                    </Typography>
                  )}
                </View>
              </View>
            </SectionCard>
          )}

          {/* Why Not Covered - Detailed Explanation */}
          {!product.isApproved && (
            <SectionCard style={{ marginBottom: 12, borderColor: '#FCA5A5' }}>
              <View style={styles.explanationItem}>
                <MaterialCommunityIcons name="information" size={24} color="#EF4444" />
                <View style={styles.explanationText}>
                  <Typography variant="subheading" weight="600" style={{ marginBottom: 8, color: '#EF4444' }}>
                    {t('scanner.whyNotCovered')}
                  </Typography>
                  
                  {/* Package size not allowed */}
                  {product.reasons.includes("package_size_not_allowed") && (
                    <>
                      {product.category === "milk" && product.size_oz === 128 && (
                        <Typography variant="body" style={{ marginBottom: 8, lineHeight: 20 }}>
                          {t('scanner.milkPolicyExplanation')}
                        </Typography>
                      )}
                      {product.category === "bread" && product.size_oz !== 16 && (
                        <Typography variant="body" style={{ marginBottom: 8, lineHeight: 20 }}>
                          {t('scanner.breadPolicyExplanation')}
                        </Typography>
                      )}
                      {product.category === "cereal" && (
                        <Typography variant="body" style={{ marginBottom: 8, lineHeight: 20 }}>
                          {t('scanner.cerealPolicyExplanation')}
                        </Typography>
                      )}
                    </>
                  )}
                  
                  {/* Exceeds monthly limit */}
                  {product.reasons.includes("exceeds_monthly_limit") && (
                    <Typography variant="body" style={{ marginBottom: 8, lineHeight: 20 }}>
                      {t('scanner.monthlyLimitExplanation')}
                    </Typography>
                  )}
                  
                  {/* Brand not approved */}
                  {product.reasons.includes("brand_or_product_not_approved") && (
                    <Typography variant="body" style={{ marginBottom: 8, lineHeight: 20 }}>
                      {t('scanner.brandPolicyExplanation')}
                    </Typography>
                  )}
                  
                  {/* Product not in WIC category */}
                  {(product.reasons.includes("product_not_in_wic_category") || product.reasons.includes("notInWicCategory")) && (
                    <Typography variant="body" style={{ marginBottom: 8, lineHeight: 20 }}>
                      {t('scanner.categoryPolicyExplanation')}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
                    {t('scanner.checkAlternatives')}
                  </Typography>
                </View>
              </View>
            </SectionCard>
          )}

          {/* Alternatives - What to Buy Instead */}
          {product.alternatives && product.alternatives.length > 0 && (
            <SectionCard style={{ marginBottom: 12, borderColor: '#86EFAC', backgroundColor: '#F0FDF4' }}>
              <View style={styles.explanationItem}>
                <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
                <View style={styles.explanationText}>
                  <Typography variant="subheading" weight="600" style={{ marginBottom: 8, color: '#10B981' }}>
                    ✨ {t('scanner.wicApprovedAlternative')}
                  </Typography>
                  <Typography variant="body" weight="600" style={{ marginBottom: 4 }}>
                    {product.alternatives[0].suggestion}
                  </Typography>
                  <Typography variant="body" style={{ marginBottom: 12 }}>
                    {product.alternatives[0].reason}
                  </Typography>
                  
                  <TouchableOpacity
                    style={styles.alternativeButton}
                    onPress={() => {
                      const alternativeProduct = aplData.products.find(p => p.upc === product.alternatives[0].upc);
                      if (alternativeProduct) {
                        onClose();
                        (navigation as any).navigate('ProductDetail', { 
                          product: alternativeProduct, 
                          categoryName: (aplData.categories as any)[alternativeProduct.category]?.name || 'Unknown'
                        });
                      }
                    }}
                  >
                    <MaterialCommunityIcons name="arrow-right" size={16} color="white" style={{ marginRight: 6 }} />
                    <Typography variant="body" weight="600" style={{ color: 'white' }}>
                      {t('scanner.viewThisProduct')}
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>
            </SectionCard>
          )}

          {/* Category Allowance for Approved Items */}
          {product.isApproved && (
            <SectionCard style={{ marginBottom: 12, backgroundColor: '#F0FDF4' }}>
              <View style={styles.explanationItem}>
                <MaterialCommunityIcons name="information" size={24} color="#10B981" />
                <View style={styles.explanationText}>
                  <Typography variant="subheading" weight="600" style={{ marginBottom: 8 }}>
                    {t('scanner.categoryAllowance')}
                  </Typography>
                  <Typography variant="body" style={{ color: '#10B981' }}>
                    {(aplData.categories as any)[product.category]?.monthly_allowance} {(aplData.categories as any)[product.category]?.unit} {t('scanner.perMonth')}
                  </Typography>
                </View>
              </View>
            </SectionCard>
          )}
          </ScrollView>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => {
              onClose();
              (navigation as any).navigate('ProductDetail', { 
                product, 
                categoryName: (aplData.categories as any)[product.category]?.name || 'Unknown'
              });
            }}
          >
            <Typography variant="body" weight="500" style={{ color: 'white' }}>
              {t('scanner.viewProductDetails')}
            </Typography>
          </TouchableOpacity>

          <Button
            title={t('scanner.scanAnotherItem')}
            onPress={onClose}
            fullWidth
            size="medium"
            variant="outline"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: 70,
    height: 70,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  benefitCalc: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  explanationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  explanationText: {
    flex: 1,
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewDetailsButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 10,
  },
});