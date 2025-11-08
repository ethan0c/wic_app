import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert } from "react-native";
import { HelpCircle, CreditCard } from 'lucide-react-native';
import { useTheme } from "../../context/ThemeContext";
import WicLogo from "../../components/WicLogo";
import { SPACING, BORDER_RADIUS } from "../../assets/styles/shared.styles";

const AuthIndexScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  const navigateToSignIn = () => navigation.navigate("StateProvider");
  const navigateToSignUp = () => navigation.navigate("StateProvider");
  const handleCardLogin = () => navigation.navigate('CardScan', { selectedState: 'Your State' });
  const handleSkip = () => navigation.navigate('MainTabs' as never);
  const handleHelp = () => {
    Alert.alert(
      "Need Help?",
      "Contact your local WIC office:\n\n📞 1-800-WIC-HELP\n📧 support@wic.gov\n\nOffice hours: Mon-Fri 8AM-5PM",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity style={styles.helpButton} onPress={handleHelp}>
        <HelpCircle size={28} color={theme.primary} stroke={theme.primary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <WicLogo code="US" width={160} height={160} style={styles.logoImage} />
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>Supporting Healthy Families</Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={[styles.subtitle, { color: theme.text }]}>Your WIC benefits, simplified.</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            • Check your benefits balance{"\n"}
            • Find approved foods{"\n"}
            • Locate WIC clinics nearby{"\n"}
            • Track appointments{"\n"}
            • Get nutrition resources
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.cardButton, { backgroundColor: theme.primary }]} onPress={handleCardLogin} activeOpacity={0.8}>
            <CreditCard size={24} color="white" stroke="white" />
            <Text style={styles.cardButtonText}>Login with WIC Card</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.buttonBackground }]} onPress={navigateToSignUp} activeOpacity={0.8}>
            <Text style={[styles.primaryButtonText, { color: theme.buttonText }]}>Sign up (optional)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryButton, { borderColor: theme.border }]} onPress={navigateToSignIn} activeOpacity={0.8}>
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipLink} onPress={handleSkip} activeOpacity={0.7}>
            <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip adding card for now →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  helpButton: { position: 'absolute', top: 60, right: 20, zIndex: 10, padding: 8 },
  content: { flex: 1, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xxl, justifyContent: 'space-between' },
  logoSection: { alignItems: 'center', marginTop: SPACING.xxl },
  logoImage: { width: 160, height: 160, marginBottom: SPACING.lg },
  tagline: { fontSize: 16, fontWeight: '300', textAlign: 'center' },
  featuresSection: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.md },
  subtitle: { fontSize: 26, fontWeight: '300', marginBottom: SPACING.lg, textAlign: 'center', letterSpacing: -0.5 },
  description: { fontSize: 16, fontWeight: '300', lineHeight: 28, textAlign: 'left' },
  buttonContainer: { gap: SPACING.md },
  cardButton: { paddingVertical: 18, borderRadius: BORDER_RADIUS.full, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 12 },
  cardButtonText: { color: 'white', fontSize: 17, fontWeight: '500', letterSpacing: 0.3 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 14, fontWeight: '300' },
  primaryButton: { paddingVertical: 18, borderRadius: BORDER_RADIUS.full, alignItems: 'center' },
  primaryButtonText: { fontSize: 17, fontWeight: '400', letterSpacing: 0.3 },
  secondaryButton: { paddingVertical: 18, borderRadius: BORDER_RADIUS.full, alignItems: 'center', borderWidth: 1 },
  secondaryButtonText: { fontSize: 17, fontWeight: '300' },
  skipLink: { paddingVertical: 4, alignItems: 'center' },
  skipText: { fontSize: 14, fontWeight: '300' },
});

export default AuthIndexScreen;