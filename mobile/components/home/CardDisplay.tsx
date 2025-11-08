import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Typography from '../Typography';

interface CardDisplayProps {
  cardNumber?: string;
  onPress?: () => void;
}

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CardDisplay({ cardNumber = '4829', onPress }: CardDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handleCardPress = () => {
    // Configure smooth layout animation
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' }
    });

    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);

    // Animate chevron rotation
    Animated.timing(rotateAnim, {
      toValue: newIsExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (newIsExpanded) {
      // Animate content fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Animate content fade out and scale down
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }

    onPress?.();
  };

  const handleRemoveCard = () => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this WIC card from your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          Alert.alert('Card Removed', 'Your WIC card has been removed from this app.');
        }},
      ]
    );
  };

  const handleSwitchCard = () => {
    Alert.alert(
      'Switch Card',
      'Would you like to add a different WIC card or scan a new one?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Scan New Card', onPress: () => {
          Alert.alert('Scan Card', 'This would open the card scanner feature.');
        }},
        { text: 'Add Manually', onPress: () => {
          Alert.alert('Add Card', 'This would open the manual card entry form.');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cardInfo} activeOpacity={0.7} onPress={handleCardPress}>
        <View style={styles.cardLeft}>
          <Ionicons name="card-outline" size={16} color="#1A1A1A" />
          <Typography variant="caption" style={{ color: '#1A1A1A', marginLeft: 6 }}>
            Card ending in {cardNumber}
          </Typography>
        </View>
        <Animated.View style={{
          transform: [{ 
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg']
            }) 
          }]
        }}>
          <Ionicons 
            name="chevron-down" 
            size={16} 
            color="#1A1A1A" 
          />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View 
          style={[
            styles.expandedContent,
            {
              opacity: fadeAnim,
              transform: [
                { 
                  scaleY: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                },
                {
                  translateY: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0]
                  })
                }
              ]
            }
          ]}
        >
          {/* Card Details */}
          <View style={styles.cardDetails}>
            <Typography variant="label" weight="600" style={{ marginBottom: 8 }}>
              Card Details
            </Typography>
            <View style={styles.detailRow}>
              <Typography variant="caption" color="textSecondary">Card Number:</Typography>
              <Typography variant="caption">•••• •••• •••• {cardNumber}</Typography>
            </View>
            <View style={styles.detailRow}>
              <Typography variant="caption" color="textSecondary">Status:</Typography>
              <Typography variant="caption" style={{ color: '#22C55E' }}>Active</Typography>
            </View>
            <View style={styles.detailRow}>
              <Typography variant="caption" color="textSecondary">Expires:</Typography>
              <Typography variant="caption">12/2025</Typography>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.switchButton]} 
              onPress={handleSwitchCard}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="swap-horizontal" size={18} color="#1D4ED8" />
              <Typography variant="caption" weight="600" style={{ color: '#1D4ED8', marginLeft: 8 }}>
                Switch Card
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.removeButton]} 
              onPress={handleRemoveCard}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="delete-outline" size={18} color="#DC2626" />
              <Typography variant="caption" weight="600" style={{ color: '#DC2626', marginLeft: 8 }}>
                Remove Card
              </Typography>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cardDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 26,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
  },
  switchButton: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
    marginLeft: 8,
  },
});