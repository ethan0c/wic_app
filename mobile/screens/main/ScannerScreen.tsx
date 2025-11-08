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
import { useWIC } from '../../context/WICContext';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import Card from '../../components/Card';

export default function ScannerScreen() {
  const { theme } = useTheme();
  const { checkItemEligibility } = useWIC();
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState<{
    eligible: boolean;
    message: string;
    alternative?: string;
    benefit?: any;
  } | null>(null);
  
  // For testing - allow manual barcode entry
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate camera scanning - In production, use expo-camera
    // For now, we'll simulate random products
    setTimeout(() => {
      const testProducts = ['milk', 'CEREAL', 'bread', 'EGG', 'cheese'];
      const randomProduct = testProducts[Math.floor(Math.random() * testProducts.length)];
      
      const result = checkItemEligibility(randomProduct);
      
      // Vibrate for feedback
      if (result.eligible) {
        Vibration.vibrate([0, 200]); // Success vibration
      } else {
        Vibration.vibrate([0, 100, 100, 100]); // Error vibration
      }
      
      setIsScanning(false);
      setScanResult(result);
      setShowResult(true);
    }, 2000);
  };

  const handleManualScan = () => {
    if (!manualBarcode.trim()) return;
    
    const result = checkItemEligibility(manualBarcode);
    
    if (result.eligible) {
      Vibration.vibrate([0, 200]);
    } else {
      Vibration.vibrate([0, 100, 100, 100]);
    }
    
    setScanResult(result);
    setShowManualEntry(false);
    setShowResult(true);
    setManualBarcode('');
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
          <View style={[
            styles.resultIcon,
            { backgroundColor: scanResult?.eligible ? '#10B98120' : '#EF444420' }
          ]}>
            <Ionicons
              name={scanResult?.eligible ? 'checkmark-circle' : 'close-circle'}
              size={80}
              color={scanResult?.eligible ? '#10B981' : '#EF4444'}
            />
          </View>

          <Typography
            variant="heading"
            align="center"
            style={{ marginBottom: 16 }}
          >
            {scanResult?.eligible ? 'WIC Approved!' : 'Not Covered'}
          </Typography>

          <Text style={[styles.resultMessage, { color: theme.text }]}>
            {scanResult?.message}
          </Text>

          {scanResult?.alternative && (
            <Card variant="outlined" padding="medium" style={{ marginTop: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="bulb" size={24} color={theme.secondary} />
                <View style={{ flex: 1 }}>
                  <Typography variant="label" style={{ marginBottom: 4 }}>
                    Alternative Option
                  </Typography>
                  <Typography variant="body">
                    {scanResult.alternative}
                  </Typography>
                </View>
              </View>
            </Card>
          )}

          {scanResult?.benefit && (
            <View style={[styles.benefitInfo, { backgroundColor: theme.primary + '10' }]}>
              <Typography variant="label" style={{ marginBottom: 8 }}>
                Remaining This Month
              </Typography>
              <Typography variant="title" color="primary">
                {scanResult.benefit.amount - scanResult.benefit.used} {scanResult.benefit.unit}
              </Typography>
            </View>
          )}

          <Button
            title="Scan Another Item"
            onPress={() => setShowResult(false)}
            fullWidth
            size="large"
            style={{ marginTop: 24 }}
          />

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
