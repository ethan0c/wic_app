import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useScannerSettings } from '../../context/ScannerSettingsContext';
import Typography from '../Typography';

interface ScannerHeaderProps {
  onReadScreen?: () => void;
}

export default function ScannerHeader({ onReadScreen }: ScannerHeaderProps) {
  const { settings, updateSettings } = useScannerSettings();

  const toggleTTS = () => {
    const newState = !settings.audioEnabled;
    updateSettings({ audioEnabled: newState });
    
    // If turning on and we have a read screen function, read it
    if (newState && onReadScreen) {
      // Small delay to let the setting update
      setTimeout(() => {
        onReadScreen();
      }, 100);
    }
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerRow}>
        <View style={{ width: 24 }} />
        <Typography variant="heading" weight="500" style={{ fontSize: 20, textAlign: 'center', flex: 1 }}>
          Scan Product
        </Typography>
        <TouchableOpacity 
          activeOpacity={0.7} 
          accessibilityRole="button" 
          accessibilityLabel={settings.audioEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
          accessibilityHint="Tap to toggle audio feedback"
          onPress={toggleTTS}
        >
          {settings.audioEnabled ? (
            <Volume2 size={24} color="#10B981" strokeWidth={2} />
          ) : (
            <VolumeX size={24} color="#6B7280" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
