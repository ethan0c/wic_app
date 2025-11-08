import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CreditCard, AlertCircle } from 'lucide-react-native';
import Typography from './Typography';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParamList } from '../navigation/MainNavigator';

type NavigationProp = StackNavigationProp<MainNavigatorParamList>;

interface CardRequiredOverlayProps {
  message?: string;
  showBlur?: boolean;
}

export default function CardRequiredOverlay({ 
  message = 'WIC card number required to view benefits',
  showBlur = true
}: CardRequiredOverlayProps) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Blur effect - blocks all touches */}
      {showBlur && (
        <View style={styles.blurContainer} pointerEvents="auto">
          <View style={styles.blurFallback} />
        </View>
      )}

      {/* Content - allows touches */}
      <View style={styles.content} pointerEvents="auto">
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CreditCard size={48} color="#22C55E" strokeWidth={2} />
          </View>
          <View style={styles.alertBadge}>
            <AlertCircle size={20} color="#FFFFFF" fill="#DC2626" />
          </View>
        </View>

        <Typography variant="heading" style={styles.title}>
          Card Number Required
        </Typography>

        <Typography variant="body" color="textSecondary" style={styles.message}>
          {message}
        </Typography>

        <Button
          title="Enter WIC Card Number"
          onPress={() => navigation.navigate('WicCard')}
          size="large"
          fullWidth
          style={styles.button}
        />

        <Typography variant="caption" color="textSecondary" style={styles.hint}>
          💡 Your card number is stored securely and used to personalize your benefits and purchase history
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 999,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 245, 245, 0.98)',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    maxWidth: 400,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#BBF7D0',
  },
  alertBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    marginBottom: 16,
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
});
