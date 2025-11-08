import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWicCard } from '../../context/WicCardContext';
import { validateWicCard } from '../../services/wicApi';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import { CreditCard, X } from 'lucide-react-native';

export default function WicCardScreen() {
  const navigation = useNavigation();
  const { cardNumber, setCardNumber, clearCardNumber } = useWicCard();
  const [inputValue, setInputValue] = useState(cardNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!inputValue.trim()) {
      Alert.alert('Invalid Card', 'Please enter a WIC card number');
      return;
    }

    // Basic validation - WIC card numbers are typically 10-19 digits
    if (!/^\d{10,19}$/.test(inputValue.trim())) {
      Alert.alert('Invalid Card', 'Please enter a valid WIC card number (10-19 digits)');
      return;
    }

    setIsSaving(true);
    try {
      // Validate card with server
      const validation = await validateWicCard(inputValue.trim());
      
      if (!validation.valid) {
        Alert.alert(
          'Card Not Found',
          'This WIC card number was not found in our system. Please check the number and try again.\n\nTest cards:\n• 1234567890 (Heavy user)\n• 0987654321 (Moderate user)\n• 5555555555 (Light user)'
        );
        setIsSaving(false);
        return;
      }

      // Card is valid, save it
      await setCardNumber(inputValue.trim());
      
      Alert.alert('Success', 'WIC card number saved successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error validating card:', error);
      Alert.alert(
        'Validation Error',
        'Unable to validate card number. Please check your internet connection and try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    Alert.alert(
      'Clear WIC Card',
      'Your benefits and home screens will be locked until you enter a new card number. You can still use the scanner and explore products.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCardNumber();
              setInputValue('');
              Alert.alert(
                'Card Removed', 
                'Please enter a WIC card number to access your benefits and purchase history',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to clear WIC card number');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <X size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Typography variant="title" style={styles.headerTitle}>
          WIC Card Number
        </Typography>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CreditCard size={64} color="#22C55E" />
        </View>

        <Typography variant="heading" style={styles.title}>
          Enter Your WIC Card Number
        </Typography>

        <Typography variant="body" color="textSecondary" style={styles.description}>
          Your WIC card number is used to track your benefits, purchase history, and shopping lists
        </Typography>

        <View style={styles.inputContainer}>
          <Typography variant="label" style={styles.label}>
            Card Number
          </Typography>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter 10-19 digit card number"
            keyboardType="number-pad"
            maxLength={19}
            autoFocus={!cardNumber}
          />
        </View>

        {cardNumber && (
          <Typography variant="caption" color="textSecondary" style={styles.currentCard}>
            Current card: {cardNumber}
          </Typography>
        )}

        <Button
          title="Save Card Number"
          onPress={handleSave}
          loading={isSaving}
          fullWidth
          size="large"
          style={styles.saveButton}
        />

        {cardNumber && (
          <Button
            title="Clear Card Number"
            onPress={handleClear}
            variant="outline"
            fullWidth
            size="large"
            style={styles.clearButton}
          />
        )}

        <View style={styles.infoBox}>
          <Typography variant="caption" color="textSecondary" style={styles.infoText}>
            💡 Your card number is stored securely on your device and is used to personalize your experience
          </Typography>
        </View>

        <View style={styles.testCardsBox}>
          <Typography variant="caption" style={styles.testCardsTitle}>
            🧪 Test Card Numbers
          </Typography>
          <Typography variant="caption" color="textSecondary" style={styles.testCardsText}>
            • 1234567890 - Heavy user (low benefits){'\n'}
            • 0987654321 - Moderate user{'\n'}
            • 5555555555 - Light user (high benefits)
          </Typography>
        </View>

        {cardNumber && (
          <View style={styles.warningBox}>
            <Typography variant="caption" style={styles.warningText}>
              ⚠️ Removing your card will lock your Benefits and Home screens. You can still use Scanner and Explore features.
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
    backgroundColor: '#FFFFFF',
  },
  currentCard: {
    textAlign: 'center',
    marginBottom: 24,
  },
  saveButton: {
    marginBottom: 12,
  },
  clearButton: {
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 12,
  },
  infoText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  testCardsBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 12,
  },
  testCardsTitle: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
    color: '#1E40AF',
  },
  testCardsText: {
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    textAlign: 'center',
    lineHeight: 18,
    color: '#92400E',
  },
});
