import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Vibration,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useScannerSettings } from '../../context/ScannerSettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWicCard } from '../../context/WicCardContext';
import audioFeedback from '../../services/audioFeedback';
import aplData from '../../data/apl.json';
import * as Speech from 'expo-speech';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import { scanProductByUPC } from '../../services/wicApi';

// Scanner Components
import ScanArea from '../../components/scanner/ScanArea';
import ScanInstructions from '../../components/scanner/ScanInstructions';
import DemoExamples from '../../components/scanner/DemoExamples';
import ManualEntry from '../../components/scanner/ManualEntry';
import ScanResultModal from '../../components/scanner/ScanResultModal';
import QuickResultFlash from '../../components/scanner/QuickResultFlash';
import ScannerHeader from '../../components/scanner/ScannerHeader';

type Product = {
  upc: string;
  name: string;
  brand: string;
  category: string;
  size_oz: number;
  size_display: string;
  isApproved: boolean;
  image: string;
  imageUrl?: string;  // Real product image URL
  emoji?: string;     // Category emoji fallback
  reasons: string[];
  alternatives: Array<{
    upc: string;
    suggestion: string;
    reason: string;
    imageUrl?: string;  // Alternative product image
    emoji?: string;     // Alternative emoji
  }>;
  benefitCalculation?: {  // NEW: Benefit balance info
    category: string;
    currentRemaining: number;
    afterPurchase: number;
    unit: string;
    canAfford: boolean;
    maxQuantity?: number;
  } | null;
};

type NavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function ScannerScreen({ route }: any) {
  const navigation = useNavigation<NavigationProp>();
  const { settings } = useScannerSettings();
  const { language, t } = useLanguage();
  const { cardNumber: wicCardNumber } = useWicCard();
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showQuickFlash, setShowQuickFlash] = useState(false);
  const [scanResult, setScanResult] = useState<Product | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);

  const categoryKey = route?.params?.categoryKey;

  // Helper: Get category emoji
  const getCategoryEmoji = (category: string): string => {
    const emojiMap: { [key: string]: string } = {
      'milk': '🥛',
      'dairy': '🧀',
      'bread': '🍞',
      'cereal': '🥣',
      'eggs': '🥚',
      'produce': '🍎',
      'juice': '🧃',
      'peanut_butter': '🥜',
      'beans': '🫘',
      'infant_formula': '🍼',
      'baby_food': '👶',
    };
    return emojiMap[category] || '📦';
  };

  // Helper: Calculate benefit impact
  const calculateBenefitImpact = async (product: any) => {
    try {
      // Mock benefit data for demo (no userId needed)
      const mockBenefits = [
        { category: 'Milk', totalAmount: 96, remainingAmount: 54, unit: 'oz' },
        { category: 'Bread', totalAmount: 32, remainingAmount: 16, unit: 'oz' },
        { category: 'Cereal', totalAmount: 36, remainingAmount: 36, unit: 'oz' },
        { category: 'Eggs', totalAmount: 2, remainingAmount: 1, unit: 'dozen' },
        { category: 'Produce', totalAmount: 32, remainingAmount: 18.50, unit: 'dollars' },
      ];
      
      const productCategory = product.category;
      
      // Find matching benefit category
      const benefit = mockBenefits.find(b => 
        b.category.toLowerCase().includes(productCategory) || 
        productCategory.includes(b.category.toLowerCase())
      );

      if (!benefit) {
        return null; // No matching benefit found
      }

      const currentRemaining = benefit.remainingAmount;
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
    } catch (error) {
      console.error('Failed to calculate benefit impact:', error);
      return null;
    }
  };

  const lookupProduct = async (upcOrName: string): Promise<Product | null> => {
    // First, check local APL database for demo products
    const foundProduct = aplData.products.find((p: Product) => 
      p.upc === upcOrName || 
      p.name.toLowerCase().includes(upcOrName.toLowerCase()) ||
      p.brand.toLowerCase().includes(upcOrName.toLowerCase())
    );
    
    if (foundProduct) {
      // Add emoji fallback
      const productWithEmoji: Product = {
        ...foundProduct,
        emoji: getCategoryEmoji(foundProduct.category),
      };
      
      // Add emoji to alternatives
      if (productWithEmoji.alternatives) {
        productWithEmoji.alternatives = productWithEmoji.alternatives.map(alt => ({
          ...alt,
          emoji: getCategoryEmoji(foundProduct.category),
        }));
      }
      
      // Add benefit calculation if card number available and approved
      if (wicCardNumber && productWithEmoji.isApproved) {
        productWithEmoji.benefitCalculation = await calculateBenefitImpact(productWithEmoji);
      }
      
      return productWithEmoji;
    }
    
    // Not in local database - call backend API (which uses USDA)
    try {
      console.log('🔍 Product not in local DB, checking backend API...', upcOrName);
      const scanResult = await scanProductByUPC(upcOrName, wicCardNumber || undefined);
      
      if (!scanResult.found) {
        console.log('❌ Not found in backend/USDA database');
        return null;
      }
      
      console.log('✅ Found via backend:', scanResult);
      
      // Backend returns ScanResult with usdaProduct and wicCategory
      const usdaProduct = scanResult.usdaProduct;
      const category = scanResult.wicCategory || 'unknown';
      
      // Extract size from USDA data or local product info
      let size = 0;
      const sizeText = usdaProduct?.householdServingFullText || scanResult.localProduct?.subcategory || '';
      if (sizeText) {
        const ozMatch = sizeText.match(/(\d+\.?\d*)\s*(oz|ounce)/i);
        if (ozMatch) size = parseFloat(ozMatch[1]);
        
        const gallonMatch = sizeText.match(/(\d+\.?\d*)\s*gallon/i);
        if (gallonMatch) size = parseFloat(gallonMatch[1]) * 128;
        
        const lbMatch = sizeText.match(/(\d+\.?\d*)\s*(lb|pound)/i);
        if (lbMatch) size = parseFloat(lbMatch[1]) * 16;
      }
      
      // Map backend alternatives to frontend format
      const alternatives = (scanResult.alternatives || []).map(alt => ({
        upc: alt.upc || '',
        suggestion: `Try ${alt.brand} ${alt.name} (${alt.size})`,
        reason: `This is a WIC-approved alternative in the ${alt.category} category`,
        imageUrl: alt.imageUrl,
        emoji: getCategoryEmoji(alt.category),
      }));
      
      // Convert backend result to Product type
      const product: Product = {
        upc: upcOrName,
        name: usdaProduct?.description || scanResult.localProduct?.name || 'Unknown Product',
        brand: usdaProduct?.brandOwner || usdaProduct?.brandName || scanResult.localProduct?.brand || 'Unknown',
        category,
        size_oz: size,
        size_display: size > 0 ? `${size} oz` : 'Unknown',
        isApproved: scanResult.isWicApproved,
        image: '',
        imageUrl: undefined,
        emoji: getCategoryEmoji(category),
        reasons: scanResult.isWicApproved ? [] : ['brand_or_product_not_approved'],
        alternatives,
        benefitCalculation: scanResult.benefitCalculation || null,
      };
      
      console.log('📦 Processed product:', product.isApproved ? 'APPROVED ✅' : 'NOT APPROVED ❌');
      console.log('📏 Size:', product.size_display);
      console.log('🏷️ Category:', product.category);
      console.log('💡 Alternatives:', alternatives.length);
      if (product.benefitCalculation) {
        console.log('💰 Benefit Impact:', product.benefitCalculation);
      }
      
      return product;
    } catch (error) {
      console.error('Error looking up product via backend:', error);
      return null;
    }
  };

  const speakResult = async (product: Product) => {
    if (!settings.audioEnabled) return;
    
    // Play sound effect first
    if (product.isApproved) {
      await audioFeedback.playApproved();
    } else {
      await audioFeedback.playNotApproved();
    }
    
    // Then speak the result
    const status = product.isApproved ? t('scanner.approved') : t('scanner.notApproved');
    let message = `${product.name} ${status}`;
    
    if (!product.isApproved && product.alternatives.length > 0) {
      message += ` ${product.alternatives[0].reason}. ${product.alternatives[0].suggestion}.`;
    }
    
    await audioFeedback.speak(message, language);
  };

  const handleScan = () => {
    setIsScanning(!isScanning);
  };

  const handleBarCodeScanned = async (upc: string) => {
    console.log('📷 Scanned UPC:', upc);
    
    const product = await lookupProduct(upc);
    
    if (product) {
      // Calculate benefit impact
      const benefitCalc = await calculateBenefitImpact(product);
      const productWithBenefits = {
        ...product,
        benefitCalculation: benefitCalc,
      };
      
      // Vibrate for feedback
      if (product.isApproved) {
        Vibration.vibrate([0, 200]); // Success vibration
      } else {
        Vibration.vibrate([0, 100, 100, 100]); // Error vibration
      }
      
      setScanResult(productWithBenefits);
      setIsScanning(false);
      
      // Show quick flash first
      setShowQuickFlash(true);
      
      // Then show full modal after 1.5 seconds
      setTimeout(() => {
        setShowQuickFlash(false);
        setShowResult(true);
        speakResult(productWithBenefits);
      }, 1500);
    } else {
      // Create a "not found" product
      const notFound: Product = {
        upc,
        name: "Unknown Product",
        brand: "Unknown",
        category: "unknown",
        size_oz: 0,
        size_display: "Unknown",
        isApproved: false,
        image: "",
        reasons: ["product_not_found"],
        alternatives: []
      };
      setScanResult(notFound);
      setIsScanning(false);
      
      setShowQuickFlash(true);
      setTimeout(() => {
        setShowQuickFlash(false);
        setShowResult(true);
      }, 1500);
      
      Vibration.vibrate([0, 100, 100, 100]);
    }
  };

  const handleManualScan = async (barcode: string) => {
    const product = await lookupProduct(barcode);
    
    if (product) {
      // Calculate benefit impact
      const benefitCalc = await calculateBenefitImpact(product);
      const productWithBenefits = {
        ...product,
        benefitCalculation: benefitCalc,
      };
      
      if (product.isApproved) {
        Vibration.vibrate([0, 200]);
      } else {
        Vibration.vibrate([0, 100, 100, 100]);
      }
      
      setScanResult(productWithBenefits);
      setShowManualEntry(false);
      
      // Show quick flash first
      setShowQuickFlash(true);
      
      // Then show full modal after 1.5 seconds
      setTimeout(() => {
        setShowQuickFlash(false);
        setShowResult(true);
        speakResult(productWithBenefits);
      }, 1500);
    } else {
      // Create a "not found" product for demo
      const notFound: Product = {
        upc: barcode,
        name: "Unknown Product",
        brand: "Unknown",
        category: "unknown",
        size_oz: 0,
        size_display: "Unknown",
        isApproved: false,
        image: "",
        reasons: ["product_not_found"],
        alternatives: []
      };
      setScanResult(notFound);
      setShowManualEntry(false);
      
      setShowQuickFlash(true);
      setTimeout(() => {
        setShowQuickFlash(false);
        setShowResult(true);
      }, 1500);
      
      Vibration.vibrate([0, 100, 100, 100]);
    }
  };

  const handleProductSelect = async (product: Product) => {
    // Calculate benefit impact
    const benefitCalc = await calculateBenefitImpact(product);
    const productWithBenefits = {
      ...product,
      benefitCalculation: benefitCalc,
    };
    
    if (product.isApproved) {
      Vibration.vibrate([0, 200]);
    } else {
      Vibration.vibrate([0, 100, 100, 100]);
    }
    
    setScanResult(productWithBenefits);
    
    // Show quick flash first
    setShowQuickFlash(true);
    
    // Then show full modal after 1.5 seconds
    setTimeout(() => {
      setShowQuickFlash(false);
      setShowResult(true);
      speakResult(productWithBenefits);
    }, 1500);
  };

  const handleCloseResult = () => {
    Speech.stop(); // Stop any ongoing speech
    setShowResult(false);
  };

  const getResultMessage = (product: Product): string => {
    if (product.isApproved) {
      return `${product.name} ${t('scanner.byBrand')} ${product.brand} (${product.size_display}) ${t('scanner.isApproved')}`;
    } else {
      // Handle specific reasons why the product is not covered
      if (product.reasons.includes("product_not_found")) {
        return t('scanner.productNotFound');
      }
      
      if (product.reasons.includes("product_not_in_wic_category") || product.reasons.includes("notInWicCategory")) {
        return t('scanner.notInWicCategory');
      }
      
      if (product.reasons.includes("cannot_determine_size")) {
        return t('scanner.cannotDetermineSize');
      }
      
      if (product.reasons.includes("brand_or_product_not_approved")) {
        return t('scanner.brandNotApproved');
      }
      
      if (product.reasons.includes("package_size_not_allowed")) {
        const categoryRules = (aplData.rules as any)[product.category];
        
        // Provide specific messaging based on category
        if (product.category === "milk" && product.size_oz === 128) {
          return `${product.name} (${product.size_display}) ${t('scanner.wrongSize')}. ${t('scanner.milkSizeRule')}`;
        }
        
        if (product.category === "bread" && product.size_oz !== 16) {
          return `${product.name} (${product.size_display}) ${t('scanner.wrongSize')}. ${t('scanner.breadSizeRule')}`;
        }
        
        if (product.category === "cereal") {
          return `${product.name} (${product.size_display}) ${t('scanner.cerealSizeRule')}`;
        }
        
        // Generic size restriction message
        return categoryRules?.messages?.size_restriction?.en || `${product.name} (${product.size_display}) ${t('scanner.wrongSize')}`;
      }
      
      return `${product.name} ${t('scanner.byBrand')} ${product.brand} (${product.size_display}) ${t('scanner.notCovered')}`;
    }
  };





  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      <View style={styles.headerSection}>
        <ScannerHeader />
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <ScanArea
          isScanning={isScanning}
          onStartScan={handleScan}
          onManualEntry={() => setShowManualEntry(true)}
          onBarCodeScanned={handleBarCodeScanned}
        />
        
        <ScanInstructions />
        
        <DemoExamples onProductSelect={handleProductSelect} />

        <View style={{ height: 10 }} />
      </ScrollView>

      <ScanResultModal
        visible={showResult}
        product={scanResult}
        language={language}
        onClose={handleCloseResult}
        onSpeakResult={() => scanResult && speakResult(scanResult)}
      />
      
      <ManualEntry
        visible={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        onSubmit={handleManualScan}
      />

      <QuickResultFlash
        visible={showQuickFlash}
        isApproved={scanResult?.isApproved ?? false}
        productName={scanResult?.name ?? ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});
