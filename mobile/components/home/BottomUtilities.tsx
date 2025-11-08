import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { HelpCircle, Share2, UserCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../Typography';

export default function BottomUtilities() {
  const { theme } = useTheme();

  const utilities = [
    { key: 'support', title: 'Support', icon: HelpCircle },
    { key: 'share', title: 'Share', icon: Share2 },
    { key: 'account', title: 'Account', icon: UserCircle },
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
            <util.icon size={24} color={theme.text} stroke={theme.text} />
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
