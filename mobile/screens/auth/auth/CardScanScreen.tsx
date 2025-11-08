import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Vibration,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import { SPACING, BORDER_RADIUS } from '../../../assets/styles/shared.styles';

export default function CardScanScreen({ route }: any) {
  const { selectedState } = route.params || { selectedState: 'Pennsylvania' };
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const navigation = useNavigation();
  
  const [isScanning, setIsScanning] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate barcode scanning - In production, use expo-camera
    setTimeout(() => {
      const mockCardNumber = `WIC${Math.floor(Math.random() * 1000000000)}`;
      Vibration.vibrate(200);
      setIsScanning(false);
      handleCardSubmit(mockCardNumber);
    }, 2000);
  };

  const handleCardSubmit = async (cardNum: string) => {
    setLoading(true);
    setError('');
    
    // Validate card number format (basic check)
    if (cardNum.length < 8) {
      setError('Card number must be at least 8 characters');
      setLoading(false);
      return;
    }

    // Sign in with card number as identifier
    const result = await signIn(cardNum, selectedState);
    
    if (result.success) {
      // Navigation happens automatically via AuthContext
    } else {
      setError(result.error || 'Invalid card number');
      Vibration.vibrate([0, 100, 100, 100]);
    }
    
    setLoading(false);
  };

  const handleManualSubmit = () => {
    if (!cardNumber.trim()) {
      setError('Please enter your card number');
      return;
    }
    handleCardSubmit(cardNumber);
  };

  const ManualEntryModal = () => (
    <Modal
      visible={showManualEntry}
      transparent
      animationType="slide"
      onRequestClose={() => setShowManualEntry(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <Typography variant="heading" align="center" style={{ marginBottom: 8 }}>
            Enter Card Number
          </Typography>

          <Text style={[styles.modalSubtext, { color: theme.textSecondary }]}>
            Enter the number on your WIC EBT card
          </Text>

          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: error ? '#EF4444' : theme.border,
            }]}
            placeholder="Card number"
            placeholderTextColor={theme.textSecondary}
            value={cardNumber}
            onChangeText={(text) => {
              setCardNumber(text);
              setError('');
            }}
            keyboardType="number-pad"
            autoFocus
            maxLength={16}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button
            title="Continue"
            onPress={handleManualSubmit}
            loading={loading}
            fullWidth
            size="large"
          />

          <TouchableOpacity
            onPress={() => {
              setShowManualEntry(false);
              setCardNumber('');
              setError('');
            }}
            style={{ marginTop: 16, padding: 8 }}
          >
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.stateTag}>
          <Ionicons name="location" size={16} color={theme.primary} />
          <Text style={[styles.stateText, { color: theme.text }]}>{selectedState}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Typography variant="heading" align="center" style={{ marginBottom: 8 }}>
          Scan Your WIC Card
        </Typography>
        
        <Typography variant="body" align="center" color="textSecondary" style={{ marginBottom: 48, paddingHorizontal: 20 }}>
          Hold your WIC EBT card under the camera to scan the barcode
        </Typography>

        {/* Scan Area */}
        <View style={[styles.scanArea, { borderColor: isScanning ? theme.primary : theme.border }]}>
          <Ionicons
            name="card-outline"
            size={100}
            color={isScanning ? theme.primary : theme.textSecondary}
          />
          {isScanning && (
            <View style={[styles.scanLine, { backgroundColor: theme.primary }]} />
          )}
        </View>

        <Typography variant="body" align="center" color="textSecondary" style={{ marginTop: 24, marginBottom: 32 }}>
          {isScanning ? 'Scanning...' : 'Position barcode in center'}
        </Typography>

        {/* Scan Button */}
        <Button
          title={isScanning ? 'Scanning...' : 'Start Camera Scan'}
          onPress={handleScan}
          loading={isScanning}
          fullWidth
          size="large"
        />

        {/* Manual Entry Option */}
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => setShowManualEntry(true)}
        >
          <Ionicons name="keypad-outline" size={20} color={theme.primary} />
          <Text style={[styles.manualButtonText, { color: theme.primary }]}>
            Enter card number manually
          </Text>
        </TouchableOpacity>

        {/* Info Cards */}
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          <View style={{ flex: 1 }}>
            <Typography variant="label" style={{ marginBottom: 4 }}>
              Secure & Private
            </Typography>
            <Typography variant="body" color="textSecondary">
              Your card information stays on your device only
            </Typography>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Ionicons name="help-circle-outline" size={24} color={theme.primary} />
          <View style={{ flex: 1 }}>
            <Typography variant="label" style={{ marginBottom: 4 }}>
              Need help finding your card?
            </Typography>
            <Typography variant="body" color="textSecondary">
              Contact your local WIC office at 1-800-WIC-HELP
            </Typography>
          </View>
        </View>
      </View>

      <ManualEntryModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  stateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
  },
  stateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 180,
    borderWidth: 3,
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
    height: 3,
    top: '50%',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 32,
    padding: 12,
  },
  manualButtonText: {
    fontSize: 16,
    fontWeight: '400',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    width: '100%',
    alignItems: 'flex-start',
    gap: 12,
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
  },
  modalSubtext: {
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
