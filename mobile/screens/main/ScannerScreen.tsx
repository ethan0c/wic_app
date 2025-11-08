import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import Card from '../../components/Card';
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

export default function ScannerScreen({ route }: any) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState<Product | null>(null);
  const [language, setLanguage] = useState<'en' | 'ht'>('en');
  
  // For testing - allow manual barcode entry
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

  const categoryKey = route?.params?.categoryKey;

  const lookupProduct = (upcOrName: string): Product | null => {
    return aplData.products.find((p: Product) => 
      p.upc === upcOrName || 
      p.name.toLowerCase().includes(upcOrName.toLowerCase()) ||
      p.brand.toLowerCase().includes(upcOrName.toLowerCase())
    ) || null;
  };

  const speakResult = (product: Product) => {
    const status = product.isApproved ? "approved" : "not covered";
    let message = `${product.name} by ${product.brand} is ${status} by WIC.`;
    
    if (!product.isApproved && product.alternatives.length > 0) {
      message += ` ${product.alternatives[0].reason}. ${product.alternatives[0].suggestion}.`;
    }
    
    const voice = language === 'ht' ? 'ht-HT' : 'en-US';
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

  const handleManualScan = () => {
    if (!manualBarcode.trim()) return;
    
    const product = lookupProduct(manualBarcode.trim());
    
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
        upc: manualBarcode,
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
    setManualBarcode('');
  };

  const getResultMessage = (product: Product): string => {
    if (product.isApproved) {
      return `${product.name} by ${product.brand} (${product.size_display}) is WIC approved!`;
    } else {
      if (product.reasons.includes("product_not_found")) {
        return "This product was not found in our WIC database. Please check the barcode or try a different product.";
      }
      const categoryRules = (aplData.rules as any)[product.category];
      if (categoryRules?.messages) {
        if (product.reasons.includes("package_size_not_allowed")) {
          return categoryRules.messages.size_restriction?.en || "Package size not allowed by WIC.";
        }
      }
      return `${product.name} by ${product.brand} is not covered by WIC.`;
    }
  };

  const ResultModal = () => (
    <Modal
      visible={showResult}
      transparent
      animationType="slide"
      onRequestClose={() => setShowResult(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          {/* Header with language toggle */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setLanguage(lang => lang === 'en' ? 'ht' : 'en')}
              style={[styles.langButton, { backgroundColor: theme.primary + '15' }]}
            >
              <Text style={[styles.langText, { color: theme.primary }]}>
                {language === 'en' ? 'EN' : 'HT'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => scanResult && speakResult(scanResult)}
              style={[styles.audioButton, { backgroundColor: theme.primary }]}
            >
              <Ionicons name="volume-high" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={[
            styles.resultIcon,
            { backgroundColor: scanResult?.isApproved ? '#10B98120' : '#EF444420' }
          ]}>
            <Ionicons
              name={scanResult?.isApproved ? 'checkmark-circle' : 'close-circle'}
              size={80}
              color={scanResult?.isApproved ? '#10B981' : '#EF4444'}
            />
          </View>

          <Typography
            variant="heading"
            align="center"
            style={{ marginBottom: 16 }}
          >
            {scanResult?.isApproved ? 'WIC Approved!' : 'Not Covered'}
          </Typography>

          <Text style={[styles.resultMessage, { color: theme.text }]}>
            {scanResult ? getResultMessage(scanResult) : ''}
          </Text>

          {scanResult?.alternatives && scanResult.alternatives.length > 0 && (
            <Card variant="outlined" padding="medium" style={{ marginTop: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="bulb" size={24} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <Typography variant="label" style={{ marginBottom: 4 }}>
                    Try This Instead
                  </Typography>
                  <Typography variant="body">
                    {scanResult.alternatives[0].suggestion}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
                    {scanResult.alternatives[0].reason}
                  </Typography>
                </View>
              </View>
            </Card>
          )}

          {scanResult?.isApproved && (
            <View style={[styles.benefitInfo, { backgroundColor: theme.primary + '10' }]}>
              <Typography variant="label" style={{ marginBottom: 8 }}>
                Category Allowance
              </Typography>
              <Typography variant="body" color="primary">
                {(aplData.categories as any)[scanResult.category]?.monthly_allowance} {(aplData.categories as any)[scanResult.category]?.unit} per month
              </Typography>
            </View>
          )}

          <View style={styles.modalActions}>
            <Button
              title="View Product Details"
              onPress={() => {
                setShowResult(false);
                if (scanResult) {
                  (navigation as any).navigate('ProductDetail', { 
                    product: scanResult, 
                    categoryName: (aplData.categories as any)[scanResult.category]?.name || 'Unknown'
                  });
                }
              }}
              fullWidth
              size="large"
              style={{ marginBottom: 12 }}
            />

            <Button
              title="Scan Another Item"
              onPress={() => setShowResult(false)}
              fullWidth
              size="large"
              variant="outline"
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowResult(false)}
            style={{ marginTop: 16, padding: 8 }}
          >
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ManualEntryModal = () => (
    <Modal
      visible={showManualEntry}
      transparent
      animationType="slide"
      onRequestClose={() => setShowManualEntry(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <Typography variant="heading" align="center" style={{ marginBottom: 16 }}>
            Enter Barcode
          </Typography>

          <Text style={[styles.modalSubtext, { color: theme.textSecondary }]}>
            For testing: try "milk", "CEREAL", "bread", "EGG", or "cheese"
          </Text>

          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: theme.border,
            }]}
            placeholder="Enter product barcode or name"
            placeholderTextColor={theme.textSecondary}
            value={manualBarcode}
            onChangeText={setManualBarcode}
            autoFocus
            onSubmitEditing={handleManualScan}
          />

          <Button
            title="Check Eligibility"
            onPress={handleManualScan}
            fullWidth
            size="large"
          />

          <TouchableOpacity
            onPress={() => {
              setShowManualEntry(false);
              setManualBarcode('');
            }}
            style={{ marginTop: 16, padding: 8 }}
          >
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.scanArea, { borderColor: isScanning ? theme.primary : theme.border }]}>
          <Ionicons
            name="scan-outline"
            size={120}
            color={isScanning ? theme.primary : theme.textSecondary}
          />
          {isScanning && (
            <View style={[styles.scanLine, { backgroundColor: theme.primary }]} />
          )}
        </View>

        <Typography variant="heading" align="center" style={{ marginTop: 32, marginBottom: 8 }}>
          {isScanning ? 'Scanning...' : 'Scan Product Barcode'}
        </Typography>
        
        <Typography variant="body" align="center" color="textSecondary" style={{ marginBottom: 32, paddingHorizontal: 20 }}>
          Point your camera at the barcode to check if the item is WIC-approved
        </Typography>

        <Button
          title={isScanning ? 'Scanning...' : 'Start Camera Scan'}
          onPress={handleScan}
          loading={isScanning}
          fullWidth
          size="large"
        />

        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => setShowManualEntry(true)}
        >
          <Ionicons name="keypad" size={20} color={theme.primary} />
          <Text style={[styles.manualButtonText, { color: theme.primary }]}>
            Enter Barcode Manually
          </Text>
        </TouchableOpacity>

        <Card variant="default" padding="medium" style={{ marginTop: 24 }}>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <Ionicons name="information-circle" size={24} color={theme.primary} />
            <View style={{ flex: 1 }}>
              <Typography variant="label" style={{ marginBottom: 6 }}>
                How to scan
              </Typography>
              <Typography variant="body" color="textSecondary">
                • Make sure the barcode is clearly visible{'\n'}
                • Hold your phone steady{'\n'}
                • Ensure good lighting{'\n'}
                • Wait for vibration feedback
              </Typography>
            </View>
          </View>
        </Card>

        <Card variant="default" padding="medium" style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <Ionicons name="volume-high" size={24} color={theme.secondary} />
            <View style={{ flex: 1 }}>
              <Typography variant="label" style={{ marginBottom: 6 }}>
                Audio Feedback
              </Typography>
              <Typography variant="body" color="textSecondary">
                Listen for approval confirmation in English or Haitian-Creole
              </Typography>
            </View>
          </View>
        </Card>
      </View>

      <ResultModal />
      <ManualEntryModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderRadius: 32,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 3,
    top: '50%',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
  },
  manualButtonText: {
    fontSize: 16,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 48,
    minHeight: '50%',
  },
  resultIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  resultMessage: {
    fontSize: 17,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 26,
  },
  benefitInfo: {
    padding: 20,
    borderRadius: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    marginTop: 16,
  },
  modalSubtext: {
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 20,
  },
});
