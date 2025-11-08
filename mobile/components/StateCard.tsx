import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import WicLogo from './WicLogo';
import { useTheme } from '../context/ThemeContext';

interface StateCardProps {
  stateName: string;
  stateApp: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function StateCard({ stateName, stateApp, isSelected, onPress }: StateCardProps) {
  const { theme } = useTheme();
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.stateItem,
          {
            backgroundColor: theme.card,
            borderColor: isSelected ? '#1A1A1A' : theme.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.stateContent}>
          <View style={styles.stateLeftContent}>
            <WicLogo stateName={stateName} width={48} height={48} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.stateName, { color: theme.text }]}>{stateName}</Text>
              <Text style={[styles.stateApp, { color: theme.textSecondary }]}>{stateApp}</Text>
            </View>
          </View>
          {isSelected && <View style={styles.checkmark} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stateItem: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  stateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stateLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  stateName: {
    fontSize: 18,
    fontWeight: '400',
    flex: 1,
  },
  stateApp: {
    fontSize: 13,
    fontWeight: '300',
    marginTop: 2,
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1A1A1A',
  },
});
