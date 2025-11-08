import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import Typography from '../Typography';
import Button from '../Button';
import SectionCard from '../home/SectionCard';
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
  imageUrl?: string;
  emoji?: string;
  reasons: string[];
  alternatives: Array<{
    upc: string;
    suggestion: string;
    reason: string;
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

  const getResultMessage = (product: Product): string => {
    if (product.isApproved) {
      return `${product.name} ${t('scanner.byBrand')} ${product.brand} (${product.size_display}) ${t('scanner.isApproved')}`;
    } else {
      if (product.reasons.includes("product_not_found")) {
        return t('scanner.productNotFound');
      }
      
      if (product.reasons.includes("package_size_not_allowed")) {
        if (product.category === "milk" && product.size_oz === 128) {
          return `${product.name} (${product.size_display}) ${t('scanner.wrongSize')}. ${t('scanner.milkSizeRule')}`;
        }
        
        if (product.category === "bread" && product.size_oz !== 16) {
          return `${product.name} (${product.size_display}) ${t('scanner.wrongSize')}. ${t('scanner.breadSizeRule')}`;
        }
        
        if (product.category === "cereal") {
          return `${product.name} (${product.size_display}) ${t('scanner.cerealSizeRule')}`;
        }
      }
      
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
            <View style={styles.headerSpacer} />
            
            <TouchableOpacity 
              onPress={onSpeakResult}
              style={styles.audioButton}
            >
              <MaterialCommunityIcons name="volume-high" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Result Status */}
          <SectionCard style={{ marginBottom: 12 }}>
            <View style={styles.resultHeader}>
              {/* Product Image or Emoji */}
              <View style={styles.productImageContainer}>
                {product.imageUrl ? (
                  <Image 
                    source={{ uri: product.imageUrl }} 
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                ) : product.emoji ? (
                  <Typography variant="heading" style={{ fontSize: 60 }}>
                    {product.emoji}
                  </Typography>
                ) : (
                  <View style={[
                    styles.resultIcon,
                    { backgroundColor: product.isApproved ? '#F0FDF4' : '#FEF2F2' }
                  ]}>
                    <MaterialCommunityIcons
                      name={product.isApproved ? 'check-circle' : 'close-circle'}
                      size={60}
                      color={product.isApproved ? '#10B981' : '#EF4444'}
                    />
                  </View>
                )}
              </View>

              <Typography variant="heading" style={{ textAlign: 'center', marginBottom: 16 }}>
                {product.isApproved ? t('scanner.approved') : t('scanner.notApproved')}
              </Typography>

              <Typography variant="body" style={{ textAlign: 'center', lineHeight: 24 }}>
                {getResultMessage(product)}
              </Typography>
            </View>
          </SectionCard>

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
                  {product.category === "milk" && product.size_oz === 128 && (
                    <Typography variant="body" style={{ marginBottom: 8 }}>
                      {t('scanner.wicPolicyAllows')} <Typography variant="body" weight="600">{t('scanner.halfGallonMilkOnly')}</Typography> {t('scanner.milkContainers')}
                    </Typography>
                  )}
                  {product.category === "bread" && product.size_oz !== 16 && (
                    <Typography variant="body" style={{ marginBottom: 8 }}>
                      {t('scanner.wicPolicyAllows')} <Typography variant="body" weight="600">{t('scanner.sixteenOunceOnly')}</Typography> {t('scanner.breadLoaves')}
                    </Typography>
                  )}
                  {product.reasons.includes("package_size_not_allowed") && (
                    <Typography variant="caption" color="textSecondary">
                      {t('scanner.packageSizeRequirements')}
                    </Typography>
                  )}
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
                    Category Allowance
                  </Typography>
                  <Typography variant="body" style={{ color: '#10B981' }}>
                    {(aplData.categories as any)[product.category]?.monthly_allowance} {(aplData.categories as any)[product.category]?.unit} per month
                  </Typography>
                </View>
              </View>
            </SectionCard>
          )}

          {/* Action Buttons */}
          <Button
            title="View Product Details"
            onPress={() => {
              onClose();
              (navigation as any).navigate('ProductDetail', { 
                product, 
                categoryName: (aplData.categories as any)[product.category]?.name || 'Unknown'
              });
            }}
            fullWidth
            size="large"
            style={{ marginBottom: 12 }}
          />

          <Button
            title="Scan Another Item"
            onPress={onClose}
            fullWidth
            size="large"
            variant="outline"
            style={{ marginBottom: 16 }}
          />

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Typography variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
              Close
            </Typography>
          </TouchableOpacity>
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
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerSpacer: {
    width: 40,
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
  },
  productImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: 90,
    height: 90,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  closeButton: {
    padding: 8,
  },
});