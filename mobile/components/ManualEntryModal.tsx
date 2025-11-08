import React from 'react';
import { Modal, View, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Text, TextInput } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import Typography from './Typography';
import Button from './Button';

interface ManualEntryModalProps {
  visible: boolean;
  onClose: () => void;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string;
}

export default function ManualEntryModal({ visible, onClose, value, onChangeText, onSubmit, loading, error }: ManualEntryModalProps) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        {/* Underlay to close when tapped outside */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.sheet, { backgroundColor: theme.card }]}>
            <Typography variant="heading" align="center" style={{ marginBottom: 8 }}>
              Enter Card Number
            </Typography>
            <Text style={[styles.subtext, { color: theme.textSecondary }]}>Enter the number on your WIC EBT card</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: error ? '#EF4444' : theme.border }]}
              placeholder="Card number"
              placeholderTextColor={theme.textSecondary}
              value={value}
              onChangeText={onChangeText}
              keyboardType="number-pad"
              autoFocus
              maxLength={16}
            />
            {!!error && (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#EF4444" stroke="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            <Button title="Continue" onPress={onSubmit} loading={loading} fullWidth size="large" />
            <Pressable onPress={onClose} style={{ marginTop: 16, padding: 8 }}>
              <Text style={[styles.closeText, { color: theme.textSecondary }]}>Cancel</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 48,
  },
  subtext: {
    fontSize: 15,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 2,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '400',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});
