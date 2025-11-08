import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Vibration,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useScannerSettings } from '../../context/ScannerSettingsContext';
import aplData from '../../data/apl.json';
import * as Speech from 'expo-speech';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';

// Scanner Components
import ScanArea from '../../components/scanner/ScanArea';
import ScanInstructions from '../../components/scanner/ScanInstructions';
import DemoExamples from '../../components/scanner/DemoExamples';
import ManualEntry from '../../components/scanner/ManualEntry';
import ScanResultModal from '../../components/scanner/ScanResultModal';

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

type NavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function ScannerScreen({ route }: any) {
  const navigation = useNavigation<NavigationProp>();
  const { settings } = useScannerSettings();
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState<Product | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);

  const categoryKey = route?.params?.categoryKey;

  const lookupProduct = (upcOrName: string): Product | null => {
    return aplData.products.find((p: Product) => 
      p.upc === upcOrName || 
      p.name.toLowerCase().includes(upcOrName.toLowerCase()) ||
      p.brand.toLowerCase().includes(upcOrName.toLowerCase())
    ) || null;
  };

  const speakResult = (product: Product) => {
    if (!settings.audioEnabled) return;
    
    const status = product.isApproved ? "approved" : "not covered";
    let message = `${product.name} by ${product.brand} is ${status} by WIC.`;
    
    if (!product.isApproved && product.alternatives.length > 0) {
      message += ` ${product.alternatives[0].reason}. ${product.alternatives[0].suggestion}.`;
    }
    
    const voice = settings.language === 'ht' ? 'ht-HT' : 'en-US';
    Speech.speak(message, { language: voice, rate: 0.8 });
  };

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate camera scanning - Demo with predefined UPCs
    setTimeout(() => {
      const testUPCs = [
        "041303001813", // Gallon milk (not approved)
        "041303001806", // Half-gallon milk (approved)  
        "016000275218", // Cheerios 18oz (approved)
        "072250015144", // Wonder 20oz bread (not approved)
        "072250015137", // Wonder 16oz bread (approved)
      ];
      const randomUPC = testUPCs[Math.floor(Math.random() * testUPCs.length)];
      
      const product = lookupProduct(randomUPC);
      
      if (product) {
        // Vibrate for feedback
        if (product.isApproved) {
          Vibration.vibrate([0, 200]); // Success vibration
        } else {
          Vibration.vibrate([0, 100, 100, 100]); // Error vibration
        }
        
        setScanResult(product);
        setShowResult(true);
        speakResult(product);
      }
      
      setIsScanning(false);
    }, 2000);
  };

  const handleManualScan = (barcode: string) => {
    const product = lookupProduct(barcode);
    
    if (product) {
      if (product.isApproved) {
        Vibration.vibrate([0, 200]);
      } else {
        Vibration.vibrate([0, 100, 100, 100]);
      }
      
      setScanResult(product);
      setShowResult(true);
      speakResult(product);
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
      setShowResult(true);
      Vibration.vibrate([0, 100, 100, 100]);
    }
    
    setShowManualEntry(false);
  };

  const handleProductSelect = (product: Product) => {
    if (product.isApproved) {
      Vibration.vibrate([0, 200]);
    } else {
      Vibration.vibrate([0, 100, 100, 100]);
    }
    
    setScanResult(product);
    setShowResult(true);
    speakResult(product);
  };

  const handleCloseResult = () => {
    Speech.stop(); // Stop any ongoing speech
    setShowResult(false);
  };

  const getResultMessage = (product: Product): string => {
    if (product.isApproved) {
      return `${product.name} by ${product.brand} (${product.size_display}) is WIC approved!`;
    } else {
      // Handle specific reasons why the product is not covered
      if (product.reasons.includes("product_not_found")) {
        return "This product was not found in our WIC database. Please check the barcode or try a different product.";
      }
      
      if (product.reasons.includes("package_size_not_allowed")) {
        const categoryRules = (aplData.rules as any)[product.category];
        
        // Provide specific messaging based on category
        if (product.category === "milk" && product.size_oz === 128) {
          return `${product.name} (${product.size_display}) is not covered. WIC only covers half-gallon milk containers, not full gallons.`;
        }
        
        if (product.category === "bread" && product.size_oz !== 16) {
          return `${product.name} (${product.size_display}) is not covered. WIC only covers 16-ounce bread loaves.`;
        }
        
        if (product.category === "cereal") {
          return `${product.name} (${product.size_display}) may exceed your monthly cereal allowance. Check if this fits within your 72-ounce monthly limit.`;
        }
        
        // Generic size restriction message
        return categoryRules?.messages?.size_restriction?.en || `${product.name} (${product.size_display}) package size is not allowed by WIC.`;
      }
      
      return `${product.name} by ${product.brand} (${product.size_display}) is not covered by WIC.`;
    }
  };





  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <ScanArea
          isScanning={isScanning}
          onStartScan={handleScan}
          onManualEntry={() => setShowManualEntry(true)}
        />
        
        <ScanInstructions />
        
        <DemoExamples onProductSelect={handleProductSelect} />

        <View style={{ height: 10 }} />
      </ScrollView>

      <ScanResultModal
        visible={showResult}
        product={scanResult}
        language={settings.language}
        onClose={handleCloseResult}
        onSpeakResult={() => scanResult && speakResult(scanResult)}
      />
      
      <ManualEntry
        visible={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        onSubmit={handleManualScan}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
});
