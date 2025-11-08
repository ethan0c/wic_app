import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Vibration } from 'react-native';
import { ArrowLeft, MapPin, Camera, CheckCircle, Keyboard, Shield, HelpCircle, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import ManualEntryModal from '../../components/ManualEntryModal';
import aplData from '../../data/apl.json';
import * as Speech from 'expo-speech';

export default function CardScanScreen({ route }: any) {
  const { selectedState } = route.params || { selectedState: 'Pennsylvania' };
  const { theme } = useTheme();
  const { signInCard, signInGuest } = useAuth();
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScanReset = () => { setScanned(false); };
  const handleCardSubmit = async (cardNum: string) => {
    setLoading(true);
    setError('');
    if (cardNum.length < 8) { setError('Card number must be at least 8 characters'); setLoading(false); return; }
    const result = await signInCard(cardNum, selectedState);
    if (!result.success) { setError(result.error || 'Invalid card number'); Vibration.vibrate([0,100,100,100]); }
    setLoading(false);
  };
  const handleManualSubmit = () => { if (!cardNumber.trim()) { setError('Please enter your card number'); return; } handleCardSubmit(cardNumber.trim()); };
  const onBarCodeScanned = ({ data }: { data: string }) => { if (scanned) return; setScanned(true); Vibration.vibrate(150); handleCardSubmit(data); };

  const goToHome = async () => {
    // Mark user as authenticated (guest) then reset to MainApp stack
    await signInGuest();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainApp' as never }],
      })
    );
  };

  const closeManual = () => { setShowManualEntry(false); setCardNumber(''); setError(''); };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>      
      <View style={styles.header}>        
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><ArrowLeft size={24} color={theme.text} stroke={theme.text} /></TouchableOpacity>
        <View style={styles.stateTag}><MapPin size={16} color={theme.primary} stroke={theme.primary} /><Text style={[styles.stateText, { color: theme.text }]}>{selectedState}</Text></View>
      </View>
      <View style={styles.content}>        
        <Typography variant="heading" align="center" style={{ marginBottom: 8, fontSize: 20 }}>Scan Your WIC Card</Typography>
        <Typography variant="body" align="center" color="textSecondary" style={{ marginBottom: 32, paddingHorizontal: 16, fontSize: 14 }}>Hold your WIC EBT card under the camera to scan the barcode</Typography>
        <View style={[styles.scanArea, { borderColor: theme.border }]}>          
          {/* Placeholder for regular React Native camera integration */}
          {!scanned && (
            <View style={{ alignItems: 'center' }}>
              <Camera size={48} color={theme.textSecondary} stroke={theme.textSecondary} />
              <Typography variant="body" align="center" color="textSecondary" style={{ marginTop: 12 }}>
                Camera scan coming soon. Use manual entry below.
              </Typography>
            </View>
          )}
          {scanned && (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <CheckCircle size={72} color="#10B981" stroke="#10B981" />
              <Typography variant="body" align="center" style={{ marginTop: 12 }}>Card scanned</Typography>
              <Button title="Scan Again" onPress={handleScanReset} size="small" style={{ marginTop: 16 }} />
            </View>
          )}
        </View>
  <Typography variant="body" align="center" color="textSecondary" style={{ marginTop: 24, marginBottom: 32, fontSize: 14 }}>{scanned ? 'Scanned successfully' : 'Use your camera to scan (pending) or enter manually'}</Typography>
        <TouchableOpacity style={styles.manualButton} onPress={() => setShowManualEntry(true)}>
          <Keyboard size={20} color={theme.primary} stroke={theme.primary} />
          <Text style={[styles.manualButtonText, { color: theme.primary }]}>{scanned ? 'Or enter manually' : 'Enter card number manually'}</Text>
        </TouchableOpacity>
        <View style={[
          styles.infoCard,
          { backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)' }
        ]}>
          <Shield size={18} color={theme.text} stroke={theme.text} />
          <View style={{ flex: 1 }}>
            <Typography variant="label" style={{ marginBottom: 2, fontSize: 14 }}>Secure & Private</Typography>
            <Typography variant="body" color="textSecondary" style={{ fontSize: 13 }}>Your card information stays on your device only</Typography>
          </View>
        </View>
        <View style={[
          styles.infoCard,
          { backgroundColor: 'rgba(14,165,233,0.08)', borderWidth: 1, borderColor: 'rgba(14,165,233,0.25)' }
        ]}>
          <HelpCircle size={18} color={theme.text} stroke={theme.text} />
          <View style={{ flex: 1 }}>
            <Typography variant="label" style={{ marginBottom: 2, fontSize: 14 }}>Need help finding your card?</Typography>
            <Typography variant="body" color="textSecondary" style={{ fontSize: 13 }}>Contact your local WIC office at 1-800-WIC-HELP</Typography>
          </View>
        </View>

        <TouchableOpacity onPress={goToHome} style={styles.skipLink} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip for now →</Text>
        </TouchableOpacity>
      </View>
      <ManualEntryModal
        visible={showManualEntry}
        onClose={closeManual}
        value={cardNumber}
        onChangeText={(text) => { setCardNumber(text); setError(''); }}
        onSubmit={handleManualSubmit}
        loading={loading}
        error={error}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  stateTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: 'rgba(14, 165, 233, 0.1)' },
  stateText: { fontSize: 14, fontWeight: '500' },
  content: { flex: 1, paddingHorizontal: 20, alignItems: 'center' },
  scanArea: { width: 280, height: 180, borderWidth: 3, borderRadius: 20, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  manualButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 32, padding: 12 },
  manualButtonText: { fontSize: 15, fontWeight: '400' },
  infoCard: { flexDirection: 'row', padding: 12, borderRadius: 12, marginBottom: 10, width: '100%', alignItems: 'flex-start', gap: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: 48 },
  modalSubtext: { fontSize: 15, fontWeight: '300', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 18, fontWeight: '400', marginBottom: 12, textAlign: 'center', letterSpacing: 2 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  errorText: { fontSize: 14, color: '#EF4444', fontWeight: '400' },
  closeText: { fontSize: 16, fontWeight: '400', textAlign: 'center' },
  skipLink: { paddingVertical: 8 },
  skipText: { fontSize: 13, fontWeight: '300', textAlign: 'center' },
});
