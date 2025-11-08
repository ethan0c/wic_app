import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ScanLine, Keyboard } from 'lucide-react-native';
import Typography from '../Typography';
import Button from '../Button';

interface ScanAreaProps {
  isScanning: boolean;
  onStartScan: () => void;
  onManualEntry: () => void;
}

export default function ScanArea({ isScanning, onStartScan, onManualEntry }: ScanAreaProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.scanArea, { borderColor: isScanning ? '#1A1A1A' : '#E5E7EB' }]}>
        <ScanLine
          size={80}
          color={isScanning ? '#1A1A1A' : '#9CA3AF'}
          stroke={isScanning ? '#1A1A1A' : '#9CA3AF'}
        />
        {isScanning && (
          <View style={styles.scanLine} />
        )}
      </View>

      <Typography variant="heading" style={{ marginTop: 24, marginBottom: 8, textAlign: 'center' }}>
        {isScanning ? 'Scanning...' : 'Scan Product Barcode'}
      </Typography>
      
      <Typography variant="body" color="textSecondary" style={{ marginBottom: 24, textAlign: 'center', paddingHorizontal: 20 }}>
        Point your camera at the barcode to check if the item is WIC-approved
      </Typography>

      <Button
        title={isScanning ? 'Scanning...' : 'Start Camera Scan'}
        onPress={onStartScan}
        loading={isScanning}
        fullWidth
        size="large"
        style={{ marginBottom: 12 }}
      />

      <TouchableOpacity
        style={styles.manualButton}
        onPress={onManualEntry}
      >
        <Keyboard size={20} color="#1A1A1A" stroke="#1A1A1A" />
        <Typography variant="body" style={{ color: '#1A1A1A', marginLeft: 8 }}>
          Enter Barcode Manually
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
  scanArea: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#1A1A1A',
    top: '50%',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
});