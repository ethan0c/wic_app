import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Typography from '../Typography';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  children?: ReactNode;
}

export default function SectionCard({ title, subtitle, right, style, contentStyle, children }: SectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      {(title || right) && (
        <View style={styles.headerRow}>
          {title ? (
            <Typography variant="title" weight="600">{title}</Typography>
          ) : <View />}
          {right ? <View>{right}</View> : <View />}
        </View>
      )}
      {subtitle ? (
        <Typography variant="body" color="textSecondary" style={{ marginTop: 4, marginBottom: 12 }}>
          {subtitle}
        </Typography>
      ) : null}
      <View style={contentStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
