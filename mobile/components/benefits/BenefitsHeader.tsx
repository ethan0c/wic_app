import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { CreditCard, RefreshCw, Trash2, X } from 'lucide-react-native';
import Typography from '../Typography';
import Button from '../Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import { useWicCard } from '../../context/WicCardContext';

type NavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function BenefitsHeader() {
  const navigation = useNavigation<NavigationProp>();
  const { cardNumber, clearCardNumber } = useWicCard();
  const [showModal, setShowModal] = useState(false);

  // Format card number with dots - last 4 digits only
  const formatCardNumber = (card: string) => {
    const lastFour = card.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  const handleSwitchCard = () => {
    setShowModal(false);
    navigation.navigate('WicCard');
  };

  const handleRemoveCard = () => {
    setShowModal(false);
    Alert.alert(
      'Remove WIC Card',
      'Your benefits and home screens will be locked until you enter a new card number. You can still use the scanner and explore products.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCardNumber();
              Alert.alert(
                'Card Removed',
                'Please enter a WIC card number to access your benefits',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to remove WIC card number');
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <View style={{ width: 24 }} />
          <View style={styles.centerContent}>
            <Typography variant="heading" weight="500" style={{ fontSize: 20, textAlign: 'center' }}>
              My Benefits
            </Typography>
            {cardNumber && (
              <Typography 
                variant="caption" 
                color="textSecondary" 
                style={styles.cardNumberText}
              >
                Card: •••• {cardNumber.slice(-4)}
              </Typography>
            )}
          </View>
          <TouchableOpacity 
            activeOpacity={0.7} 
            accessibilityRole="button" 
            accessibilityLabel="Card Settings"
            onPress={() => setShowModal(true)}
          >
            <CreditCard size={24} color="#1A1A1A" stroke="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Management Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Typography variant="title" weight="600">
                Card Management
              </Typography>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Current Card Info */}
            {cardNumber && (
              <View style={styles.cardInfoSection}>
                <View style={styles.cardIconContainer}>
                  <CreditCard size={24} color="#22C55E" />
                </View>
                <View style={styles.cardDetails}>
                  <Typography variant="caption" color="textSecondary">
                    Active Card
                  </Typography>
                  <Typography 
                    variant="body" 
                    weight="600" 
                    style={[styles.modalCardNumber, { fontSize: 18, marginTop: 4 }]}
                  >
                    {formatCardNumber(cardNumber)}
                  </Typography>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleSwitchCard}
              >
                <View style={styles.actionIconContainer}>
                  <RefreshCw size={20} color="#1A1A1A" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Typography variant="body" weight="600">
                    {cardNumber ? 'Switch Card' : 'Add Card'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {cardNumber ? 'Change to a different WIC card' : 'Enter your WIC card number'}
                  </Typography>
                </View>
              </TouchableOpacity>

              {cardNumber && (
                <>
                  <View style={styles.divider} />
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleRemoveCard}
                  >
                    <View style={[styles.actionIconContainer, { backgroundColor: '#FEE2E2' }]}>
                      <Trash2 size={20} color="#DC2626" />
                    </View>
                    <View style={styles.actionTextContainer}>
                      <Typography variant="body" weight="600" style={{ color: '#DC2626' }}>
                        Remove Card
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Clear card from this device
                      </Typography>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Close Button */}
            <Button
              title="Close"
              onPress={() => setShowModal(false)}
              variant="outline"
              fullWidth
              style={{ marginTop: 16 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
  },
  cardNumberText: {
    marginTop: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'monospace',
    letterSpacing: 0.5,
  },
  modalCardNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'monospace',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
  },
  actionButtons: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});
