import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CreditCard, Settings } from 'lucide-react-native';
import Typography from '../Typography';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import { useWicCard } from '../../context/WicCardContext';

type NavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function BenefitsHeader() {
  const navigation = useNavigation<NavigationProp>();
  const { cardNumber } = useWicCard();

  const handleCardPress = () => {
    navigation.navigate('WicCard');
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerRow}>
        <View>
          <Typography variant="heading" weight="500" style={{ fontSize: 20 }}>
            My Benefits
          </Typography>
          {cardNumber && (
            <Typography variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
              Card: {cardNumber.slice(-4).padStart(cardNumber.length, '•')}
            </Typography>
          )}
        </View>
        <TouchableOpacity 
          activeOpacity={0.7} 
          accessibilityRole="button" 
          accessibilityLabel="Card Settings"
          onPress={handleCardPress}
        >
          <CreditCard size={24} color="#1A1A1A" stroke="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
});
