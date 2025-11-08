import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Info, Volume2 } from 'lucide-react-native';
import Typography from '../Typography';
import SectionCard from '../home/SectionCard';
import { useLanguage } from '../../context/LanguageContext';

export default function ScanInstructions() {
  const { t } = useLanguage();
  
  return (
    <View style={styles.container}>
      <SectionCard>
        <View style={styles.instructionItem}>
          <Info size={24} color="#1A1A1A" stroke="#1A1A1A" />
          <View style={styles.instructionText}>
            <Typography variant="subheading" weight="600" style={{ marginBottom: 8 }}>
              {t('scanner.instructionsHowToScan')}
            </Typography>
            <Typography variant="body" color="textSecondary">
              {t('scanner.instructionsBarcodeVisible')}{'\n'}
              {t('scanner.instructionsHoldSteady')}{'\n'}
              {t('scanner.instructionsGoodLighting')}{'\n'}
              {t('scanner.instructionsVibration')}
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
              {t('scanner.instructionsAudioTitle')}
            </Typography>
            <Typography variant="body" color="textSecondary">
              {t('scanner.instructionsAudioDesc')}
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