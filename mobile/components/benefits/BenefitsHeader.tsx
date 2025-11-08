import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CreditCard, RefreshCw, Trash2, ChevronRight } from 'lucide-react-native';
import Typography from '../Typography';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import { useWicCard } from '../../context/WicCardContext';

type NavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function BenefitsHeader() {
  const navigation = useNavigation<NavigationProp>();
  const { cardNumber, clearCardNumber } = useWicCard();

  const handleSwitchCard = () => {
    navigation.navigate('WicCard');
  };

  const handleRemoveCard = () => {
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
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Typography variant="title" weight="700" style={styles.title}>
          My Benefits
        </Typography>
        <Typography variant="caption" color="textSecondary">
          View your WIC benefits and allowances
        </Typography>
      </View>

      {/* Card Management Section */}
      {cardNumber && (
        <View style={styles.cardSection}>
          {/* Current Card Display */}
          <View style={styles.cardDisplay}>
            <View style={styles.cardIconContainer}>
              <CreditCard size={20} color="#22C55E" />
            </View>
            <View style={styles.cardInfo}>
              <Typography variant="caption" color="textSecondary" style={{ marginBottom: 2 }}>
                Active Card
              </Typography>
              <Typography variant="body" weight="600">
                {cardNumber.slice(-4).padStart(cardNumber.length, '•')}
              </Typography>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleSwitchCard}
            >
              <RefreshCw size={18} color="#1A1A1A" />
              <Typography variant="caption" weight="600" style={{ marginLeft: 6 }}>
                Switch Card
              </Typography>
              <ChevronRight size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRemoveCard}
            >
              <Trash2 size={18} color="#DC2626" />
              <Typography variant="caption" weight="600" style={{ marginLeft: 6, color: '#DC2626' }}>
                Remove Card
              </Typography>
              <ChevronRight size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* No Card State */}
      {!cardNumber && (
        <TouchableOpacity 
          style={styles.addCardButton}
          onPress={handleSwitchCard}
        >
          <CreditCard size={20} color="#F59E0B" />
          <Typography variant="body" weight="600" style={{ marginLeft: 12, color: '#B45309' }}>
            Add WIC Card Number
          </Typography>
          <ChevronRight size={20} color="#F59E0B" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  actionButtons: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
});
