import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import Typography from '../Typography';

export default function CategoriesHeader() {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerRow}>
        <View style={{ width: 24 }} />
        <Typography variant="heading" style={{ flex: 1, textAlign: 'center' }}>
          Explore
        </Typography>
        <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
          <Search size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
