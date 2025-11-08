import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { SPACING, BORDER_RADIUS } from "../../../assets/styles/shared.styles";

const AuthIndexScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  const navigateToSignIn = () => {
    navigation.navigate("SignIn");
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignUpName");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image 
            source={require('../../../assets/images/wic_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Supporting Healthy Families
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Your WIC benefits, simplified.
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            • Check your benefits balance{'\n'}
            • Find approved foods{'\n'}
            • Locate WIC clinics nearby{'\n'}
            • Track appointments{'\n'}
            • Get nutrition resources
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.buttonBackground }]}
            onPress={navigateToSignUp}
            activeOpacity={0.8}
          >
            <Text style={[styles.primaryButtonText, { color: theme.buttonText }]}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.border }]}
            onPress={navigateToSignIn}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  logoImage: {
    width: 160,
    height: 160,
    marginBottom: SPACING.lg,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
  },
  featuresSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: '300',
    marginBottom: SPACING.lg,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 28,
    textAlign: 'left',
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '300',
  },
});

export default AuthIndexScreen;
