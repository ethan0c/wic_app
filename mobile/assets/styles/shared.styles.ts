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
  // Common text styles
  heading: {
    fontSize: 28,
    fontWeight: FONT_WEIGHTS.medium,
    color: theme.text,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 22,
    fontWeight: FONT_WEIGHTS.medium,
    color: theme.text,
  },
  title: {
    fontSize: 20,
    fontWeight: FONT_WEIGHTS.medium,
    color: theme.text,
  },
  label: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.medium,
    color: theme.text,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.light,
    color: theme.text,
    lineHeight: 24,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.light,
    color: theme.textSecondary,
  },
  // Button styles
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
  // Card styles
  card: {
    backgroundColor: theme.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  // Centered content
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
});
