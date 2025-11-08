import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ScanLine, Keyboard, Camera, Focus } from 'lucide-react-native';
import Typography from '../Typography';
import Button from '../Button';

interface ScanAreaProps {
  isScanning: boolean;
  onStartScan: () => void;
  onManualEntry: () => void;
}

export default function ScanArea({ isScanning, onStartScan, onManualEntry }: ScanAreaProps) {
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      // Animate scanning line up and down
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanLineAnim.setValue(0);
    }
  }, [isScanning]);

  const scanLinePosition = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 170], // Scan area height minus scan line height
  });

  return (
    <View style={styles.container}>
      <View style={[
        styles.scanArea, 
        { 
          borderColor: isScanning ? '#1A1A1A' : '#E5E7EB',
          backgroundColor: isScanning ? 'rgba(0, 0, 0, 0.05)' : '#FFFFFF',
        }
      ]}>
        {/* Corner brackets */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        {!isScanning && (
          <View style={styles.iconContainer}>
            <ScanLine
              size={60}
              color="#9CA3AF"
              stroke="#9CA3AF"
            />
            <Typography variant="caption" color="textSecondary" style={{ marginTop: 12, textAlign: 'center' }}>
              Position barcode here
            </Typography>
          </View>
        )}

        {isScanning && (
          <>
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLinePosition }],
                },
              ]}
            >
              <View style={styles.scanLineGlow} />
            </Animated.View>
            <View style={styles.scanningOverlay}>
              <Focus size={40} color="#1A1A1A" stroke="#1A1A1A" strokeWidth={2.5} />
            </View>
          </>
        )}
      </View>

      <Typography variant="heading" style={{ marginTop: 24, marginBottom: 8, textAlign: 'center' }}>
        {isScanning ? 'Scanning...' : 'Scan Product Barcode'}
      </Typography>
      
      <Typography variant="body" color="textSecondary" style={{ marginBottom: 24, textAlign: 'center', paddingHorizontal: 20 }}>
        {isScanning 
          ? 'Hold steady for instant eligibility check' 
          : 'Point camera at barcode to instantly check if item is WIC-approved'}
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
        disabled={isScanning}
      >
        <Keyboard size={20} color={isScanning ? "#9CA3AF" : "#1A1A1A"} stroke={isScanning ? "#9CA3AF" : "#1A1A1A"} />
        <Typography variant="body" style={{ color: isScanning ? "#9CA3AF" : "#1A1A1A", marginLeft: 8 }}>
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#1A1A1A',
  },
  topLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 10,
    right: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLine: {
    position: 'absolute',
    width: '90%',
    height: 3,
    top: 15,
  },
  scanLineGlow: {
    width: '100%',
    height: '100%',
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  scanningOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
});