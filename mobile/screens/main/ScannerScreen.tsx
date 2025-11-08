import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function ScannerScreen() {
  const { theme } = useTheme();
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning - this will be replaced with actual barcode scanner
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert(
        'Scan Complete',
        'This is a prototype. Barcode scanning will be implemented with camera functionality.',
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.scanArea, { borderColor: theme.primary }]}>
          <Ionicons
            name="scan-outline"
            size={120}
            color={isScanning ? theme.primary : theme.textSecondary}
          />
          {isScanning && (
            <View style={[styles.scanLine, { backgroundColor: theme.primary }]} />
          )}
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          {isScanning ? 'Scanning...' : 'Scan Product Barcode'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Point your camera at the barcode to check if the item is WIC-approved
        </Text>

        <TouchableOpacity
          style={[
            styles.scanButton,
            { backgroundColor: theme.primary },
            isScanning && styles.scanButtonDisabled,
          ]}
          onPress={handleScan}
          disabled={isScanning}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Start Camera'}
          </Text>
        </TouchableOpacity>

        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Ionicons name="information-circle" size={24} color={theme.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              How to scan
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              • Make sure the barcode is clearly visible{'\n'}
              • Hold your phone steady{'\n'}
              • Ensure good lighting{'\n'}
              • Wait for the beep or visual confirmation
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Ionicons name="language" size={24} color={theme.secondary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              Audio Feedback
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Listen for approval confirmation in English or Haitian-Creole
            </Text>
          </View>
        </View>
      </View>
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
    borderWidth: 2,
    borderRadius: 32,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    top: '50%',
  },
  title: {
    fontSize: 26,
    fontWeight: '300',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 30,
    gap: 10,
    marginBottom: 30,
    minWidth: 200,
  },
  scanButtonDisabled: {
    opacity: 0.6,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    width: '100%',
    alignItems: 'flex-start',
    gap: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 21,
  },
});
