import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Typography from '../../components/Typography';

interface ExploreTile {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  action?: () => void;
}

export default function ExploreScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const tiles: ExploreTile[] = [
    { key: 'scan', title: 'Scan Barcode', icon: 'scan', color: theme.primary, action: () => navigation.navigate('Scanner' as never) },
    { key: 'enter', title: 'Enter UPC', icon: 'keypad', color: theme.secondary },
    { key: 'benefits', title: 'My Benefits', icon: 'list', color: '#10B981', action: () => navigation.navigate('Benefits' as never) },
    { key: 'allowed', title: 'Allowed Foods', icon: 'nutrition', color: '#6366F1' },
    { key: 'produce', title: 'Produce HQ', icon: 'leaf', color: '#059669' },
    { key: 'recipes', title: 'Recipes', icon: 'restaurant', color: '#F59E0B' },
    { key: 'help', title: 'Help', icon: 'help-circle', color: theme.primary },
    { key: 'video', title: 'Video', icon: 'play-circle', color: '#EF4444' },
    { key: 'smart', title: 'WIC Smart', icon: 'bulb', color: '#8B5CF6' },
    { key: 'feedback', title: 'Feedback', icon: 'chatbox', color: '#0EA5E9' },
    { key: 'cantbuy', title: "Couldn't Buy This", icon: 'alert', color: '#DC2626' },
    { key: 'stores', title: 'WIC Stores', icon: 'map', color: '#2563EB' },
    { key: 'office', title: 'Find WIC Office', icon: 'location', color: '#7C3AED' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Typography variant="heading" style={{ marginBottom: 8 }}>Explore</Typography>
        <Typography variant="body" color="textSecondary">Quick tools and resources</Typography>
      </View>

      <View style={styles.grid}>
        {tiles.map(tile => (
          <TouchableOpacity
            key={tile.key}
            style={[styles.tile, { backgroundColor: theme.card }]}
            onPress={() => tile.action ? tile.action() : null}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrap, { backgroundColor: (tile.color || theme.primary) + '15' }]}>
              <Ionicons name={tile.icon} size={28} color={tile.color || theme.primary} />
            </View>
            <Text style={[styles.tileText, { color: theme.text }]}>{tile.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },
  tile: { width: '48%', marginBottom: 14, borderRadius: 20, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  iconWrap: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  tileText: { fontSize: 15, fontWeight: '400' },
});
