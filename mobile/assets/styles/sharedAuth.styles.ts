import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS, FONT_WEIGHTS } from './shared.styles';

export const sharedAuthStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: FONT_WEIGHTS.light,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.light,
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.light,
    marginBottom: 16,
  },
  button: {
    padding: 18,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0.3,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.light,
  },
});

export const createSharedAuthStyles = (theme: any) => StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  formSection: {
    marginTop: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: SPACING.md,
    color: theme.textSecondary,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  googleButton: {
    flex: 1,
    backgroundColor: '#DB4437',
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: 14,
    color: theme.textSecondary,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: SPACING.sm,
    color: theme.text,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: SPACING.md,
  },
  inputContainerError: {
    borderColor: theme.error,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: theme.text,
  },
  eyeButton: {
    padding: SPACING.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  errorText: {
    fontSize: 12,
    color: theme.error,
  },
  linkButton: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.lg,
  },
  linkButtonText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '500',
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    backgroundColor: theme.buttonBackground,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.buttonText,
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  footerLink: {
    color: theme.primary,
    fontWeight: '600',
  },
});
