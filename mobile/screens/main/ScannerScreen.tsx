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

          {/* Why Not Covered - Detailed Explanation */}
          {scanResult && !scanResult.isApproved && (
            <Card variant="outlined" padding="medium" style={{ marginTop: 16, borderColor: '#EF444450' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <Ionicons name="information-circle" size={24} color="#EF4444" />
                <View style={{ flex: 1 }}>
                  <Typography variant="label" style={{ marginBottom: 8, color: '#EF4444' }}>
                    Why Not Covered
                  </Typography>
                  {scanResult.category === "milk" && scanResult.size_oz === 128 && (
                    <Typography variant="body" style={{ marginBottom: 8 }}>
                      WIC policy allows only <Typography variant="body" weight="600">half-gallon (64 oz)</Typography> milk containers. 
                      Gallon sizes are not covered to help families manage their monthly allowance.
                    </Typography>
                  )}
                  {scanResult.category === "bread" && scanResult.size_oz !== 16 && (
                    <Typography variant="body" style={{ marginBottom: 8 }}>
                      WIC policy covers only <Typography variant="body" weight="600">16-ounce</Typography> bread loaves. 
                      This helps ensure consistent nutritional value across all WIC bread purchases.
                    </Typography>
                  )}
                  {scanResult.reasons.includes("package_size_not_allowed") && (
                    <Typography variant="caption" color="textSecondary">
                      WIC has specific package size requirements for each food category.
                    </Typography>
                  )}
                </View>
              </View>
            </Card>
          )}

          {/* Alternatives - What to Buy Instead */}
          {scanResult?.alternatives && scanResult.alternatives.length > 0 && (
            <Card variant="outlined" padding="medium" style={{ 
              marginTop: 12, 
              borderColor: theme.primary + '50',
              backgroundColor: theme.primary + '05'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <Typography variant="label" style={{ marginBottom: 8, color: theme.primary }}>
                    ✨ WIC Approved Alternative
                  </Typography>
                  <Typography variant="body" weight="600" style={{ marginBottom: 4 }}>
                    {scanResult.alternatives[0].suggestion}
                  </Typography>
                  <Typography variant="body" style={{ marginBottom: 8 }}>
                    {scanResult.alternatives[0].reason}
                  </Typography>
                  
                  {/* Action button to find the alternative */}
                  <TouchableOpacity
                    style={[styles.alternativeButton, { backgroundColor: theme.primary }]}
                    onPress={() => {
                      // Look up the alternative product and show its details
                      const alternativeProduct = aplData.products.find(p => p.upc === scanResult.alternatives[0].upc);
                      if (alternativeProduct) {
                        setShowResult(false);
                        (navigation as any).navigate('ProductDetail', { 
                          product: alternativeProduct, 
                          categoryName: (aplData.categories as any)[alternativeProduct.category]?.name || 'Unknown'
                        });
                      }
                    }}
                  >
                    <Ionicons name="arrow-forward" size={16} color="white" style={{ marginRight: 6 }} />
                    <Text style={styles.alternativeButtonText}>View This Product</Text>
                  </TouchableOpacity>
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

        {/* Demo Scenarios - showcasing "why not covered" feature */}
        <Card variant="default" padding="medium" style={{ marginTop: 20 }}>
          <Typography variant="label" style={{ marginBottom: 16, textAlign: 'center' }}>
            🎯 Try Demo Examples
          </Typography>
          
          <View style={styles.demoGrid}>
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: '#EF444415', borderColor: '#EF4444' }]}
              onPress={() => {
                const product = lookupProduct("041303001813"); // Gallon milk
                if (product) {
                  setScanResult(product);
                  setShowResult(true);
                  speakResult(product);
                }
              }}
            >
              <Text style={[styles.demoButtonText, { color: '#EF4444' }]}>🥛 Gallon Milk</Text>
              <Text style={styles.demoSubtext}>Not covered → See why</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: '#10B98115', borderColor: '#10B981' }]}
              onPress={() => {
                const product = lookupProduct("041303001806"); // Half-gallon milk
                if (product) {
                  setScanResult(product);
                  setShowResult(true);
                  speakResult(product);
                }
              }}
            >
              <Text style={[styles.demoButtonText, { color: '#10B981' }]}>🥛 ½ Gallon Milk</Text>
              <Text style={styles.demoSubtext}>WIC Approved ✓</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoGrid}>
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: '#EF444415', borderColor: '#EF4444' }]}
              onPress={() => {
                const product = lookupProduct("072250015144"); // 20oz bread
                if (product) {
                  setScanResult(product);
                  setShowResult(true);
                  speakResult(product);
                }
              }}
            >
              <Text style={[styles.demoButtonText, { color: '#EF4444' }]}>🍞 20oz Bread</Text>
              <Text style={styles.demoSubtext}>Wrong size → Alternative</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: '#10B98115', borderColor: '#10B981' }]}
              onPress={() => {
                const product = lookupProduct("072250015137"); // 16oz bread
                if (product) {
                  setScanResult(product);
                  setShowResult(true);
                  speakResult(product);
                }
              }}
            >
              <Text style={[styles.demoButtonText, { color: '#10B981' }]}>🍞 16oz Bread</Text>
              <Text style={styles.demoSubtext}>WIC Approved ✓</Text>
            </TouchableOpacity>
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActions: {
    marginTop: 24,
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  alternativeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  demoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  demoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  demoSubtext: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
  },
});
