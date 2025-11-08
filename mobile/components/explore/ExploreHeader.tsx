import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Grid } from 'lucide-react-native';
import Typography from '../Typography';

export default function ExploreHeader() {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerRow}>
        <View style={{ width: 24 }} />
        <Typography variant="heading" weight="500" style={{ fontSize: 20, textAlign: 'center', flex: 1 }}>
          Explore
        </Typography>
        <TouchableOpacity 
          activeOpacity={0.7} 
          accessibilityRole="button" 
          accessibilityLabel="Menu"
          onPress={() => {}}
        >
          <Grid size={24} color="#1A1A1A" stroke="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
