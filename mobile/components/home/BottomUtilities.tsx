import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../Typography';

export default function BottomUtilities() {
  const { theme } = useTheme();

  const utilities = [
    { key: 'support', title: 'Support', icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap },
    { key: 'share', title: 'Share', icon: 'share-outline' as keyof typeof Ionicons.glyphMap },
    { key: 'account', title: 'Account', icon: 'person-circle-outline' as keyof typeof Ionicons.glyphMap },
  ];

  return (
    <View style={styles.utilitiesContainer}>
      {utilities.map(util => (
        <TouchableOpacity
          key={util.key}
          style={styles.utilityItem}
          activeOpacity={0.6}
        >
          <View style={[styles.utilityIcon, { backgroundColor: '#FFFFFF' }]}>
            <Ionicons name={util.icon} size={24} color={theme.text} />
          </View>
          <Typography variant="body" weight="500" style={[styles.utilityText, { color: theme.text }]}>
            {util.title}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  utilitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  utilityItem: {
    alignItems: 'center',
    flex: 1,
  },
  utilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  utilityText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
