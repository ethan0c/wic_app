import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import Typography from '../Typography';
import Button from '../Button';
import SectionCard from '../home/SectionCard';

interface ManualEntryProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (barcode: string) => void;
}

export default function ManualEntry({ visible, onClose, onSubmit }: ManualEntryProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [barcode, setBarcode] = useState('');

  const handleSubmit = () => {
    if (barcode.trim()) {
      onSubmit(barcode.trim());
      setBarcode('');
    }
  };

  const handleClose = () => {
    onClose();
    setBarcode('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <SectionCard>
            <Typography variant="heading" style={{ textAlign: 'center', marginBottom: 16 }}>
              {t('scanner.manualEntryTitle')}
            </Typography>

            <Typography variant="body" color="textSecondary" style={{ textAlign: 'center', marginBottom: 16 }}>
              {t('scanner.manualEntryInstructions')}
            </Typography>

            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.background,
                color: theme.text,
                borderColor: theme.border,
              }]}
              placeholder={t('scanner.manualEntryPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              value={barcode}
              onChangeText={setBarcode}
              autoFocus
              onSubmitEditing={handleSubmit}
            />

            <Button
              title={t('scanner.manualEntrySubmit')}
              onPress={handleSubmit}
              fullWidth
              size="large"
              style={{ marginBottom: 16 }}
            />

            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Typography variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
                {t('scanner.cancel')}
              </Typography>
            </TouchableOpacity>
          </SectionCard>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  cancelButton: {
    padding: 8,
  },
});