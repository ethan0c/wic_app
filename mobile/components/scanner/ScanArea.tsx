import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScanLine, Keyboard, X } from 'lucide-react-native';
import Typography from '../Typography';
import Button from '../Button';
import { useLanguage } from '../../context/LanguageContext';

interface ScanAreaProps {
  isScanning: boolean;
  onStartScan: () => void;
  onManualEntry: () => void;
  onBarCodeScanned?: (data: string) => void;
}

export default function ScanArea({ isScanning, onStartScan, onManualEntry, onBarCodeScanned }: ScanAreaProps) {
  const { t } = useLanguage();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned && onBarCodeScanned) {
      setScanned(true);
      onBarCodeScanned(data);
      // Reset after 2 seconds to allow scanning again
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const handleStartScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', t('scanner.cameraPermissionRequired'));
        return;
      }
    }
    onStartScan();
  };

  if (isScanning && permission?.granted) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'code128', 'code39'],
          }}
        >
          <View style={styles.overlay}>
            {/* Scanning frame */}
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            
            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Typography variant="body" style={{ color: 'white', textAlign: 'center', marginBottom: 8 }}>
                {t('scanner.scanAreaPositionBarcode')}
              </Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
                {t('scanner.scanAreaAutoScan')}
              </Typography>
            </View>

            {/* Close button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onStartScan}
            >
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scanArea}>
        {/* Corner brackets */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        <View style={styles.iconContainer}>
          <ScanLine
            size={60}
            color="#9CA3AF"
            stroke="#9CA3AF"
          />
          <Typography variant="caption" color="textSecondary" style={{ marginTop: 12, textAlign: 'center' }}>
            {t('scanner.scanAreaHere')}
          </Typography>
        </View>
      </View>

      <Typography variant="heading" style={{ marginTop: 24, marginBottom: 8, textAlign: 'center' }}>
        {t('scanner.scanAreaTitle')}
      </Typography>
      
      <Typography variant="body" color="textSecondary" style={{ marginBottom: 24, textAlign: 'center', paddingHorizontal: 20 }}>
        {t('scanner.scanAreaDescription')}
      </Typography>

      <Button
        title={t('scanner.scanAreaStartCamera')}
        onPress={handleStartScan}
        fullWidth
        size="large"
        style={{ marginBottom: 12 }}
      />

      <TouchableOpacity
        style={styles.manualButton}
        onPress={onManualEntry}
      >
        <Keyboard size={20} color="#1A1A1A" stroke="#1A1A1A" />
        <Typography variant="body" style={{ color: "#1A1A1A", marginLeft: 8 }}>
          {t('scanner.scanAreaManualEntry')}
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  cameraContainer: {
    width: '100%',
    height: 500,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 200,
    position: 'relative',
  },
  scanArea: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#22C55E',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
});