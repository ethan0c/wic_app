import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import Typography from '../Typography';
import { useLanguage } from '../../context/LanguageContext';

interface QuickResultFlashProps {
  visible: boolean;
  isApproved: boolean;
  productName: string;
}

export default function QuickResultFlash({ visible, isApproved, productName }: QuickResultFlashProps) {
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: isApproved ? '#10B981' : '#EF4444',
          },
        ]}
      >
        {isApproved ? (
          <CheckCircle2 size={60} color="white" strokeWidth={2.5} />
        ) : (
          <XCircle size={60} color="white" strokeWidth={2.5} />
        )}
        
        <Typography 
          variant="heading" 
          weight="700" 
          style={styles.statusText}
        >
          {isApproved ? t('scanner.approved') : t('scanner.notApproved')}
        </Typography>

        <Typography 
          variant="body" 
          style={styles.productName}
          numberOfLines={2}
        >
          {productName}
        </Typography>
      </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  productName: {
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    fontSize: 14,
  },
});
