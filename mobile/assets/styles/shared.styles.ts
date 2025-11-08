import { StyleSheet } from 'react-native';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

export const FONTS = {
  light: 'System',
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
};

export const FONT_WEIGHTS = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const createSharedStyles = (theme: any) => StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  button: {
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0.3,
  },
});
