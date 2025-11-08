import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Info, Volume2 } from 'lucide-react-native';
import Typography from '../Typography';
import SectionCard from '../home/SectionCard';

export default function ScanInstructions() {
  return (
    <View style={styles.container}>
      <SectionCard>
        <View style={styles.instructionItem}>
          <Info size={24} color="#1A1A1A" stroke="#1A1A1A" />
          <View style={styles.instructionText}>
            <Typography variant="subheading" weight="600" style={{ marginBottom: 8 }}>
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
      </SectionCard>

      <View style={{ height: 12 }} />

      <SectionCard>
        <View style={styles.instructionItem}>
          <Volume2 size={24} color="#6B7280" stroke="#6B7280" />
          <View style={styles.instructionText}>
            <Typography variant="subheading" weight="600" style={{ marginBottom: 8 }}>
              Audio Feedback
            </Typography>
            <Typography variant="body" color="textSecondary">
              Listen for approval confirmation in English or Haitian-Creole
            </Typography>
          </View>
        </View>
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  instructionText: {
    flex: 1,
  },
});