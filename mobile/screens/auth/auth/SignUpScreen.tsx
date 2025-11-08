import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { createSharedAuthStyles } from "../../assets/styles/sharedAuth.styles";
import { createSharedStyles } from "../../assets/styles/shared.styles";
import { useAuthOnboardingNavigation, AuthOnboardingStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

type SignUpEmailScreenRouteProp = RouteProp<AuthOnboardingStackParamList, 'SignUpEmail'>;

type Props = {
  route: SignUpEmailScreenRouteProp;
};

const SignUpEmailScreen = ({ route }: Props) => {
  const { firstName, lastName } = route.params;
  // Use automatic theme detection
  const { theme } = useTheme();
  const { signInWithGoogle, signInWithApple, isAuthenticating, isAuthenticated, isOnboarding } = useAuth();
  const navigation = useAuthOnboardingNavigation();
  
  // Memoize styles to prevent recreation on every render
  const styles = useMemo(() => createSharedAuthStyles(theme), [theme]);
  const sharedStyles = useMemo(() => createSharedStyles(theme), [theme]);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Handle automatic navigation after successful authentication
  useEffect(() => {
    console.log('🔍 [SignUpEmailScreen] Auth state changed:', {
      isAuthenticated,
      isOnboarding,
      shouldNavigateToOnboarding: isAuthenticated && isOnboarding
    });

    // If user is authenticated and needs onboarding, navigate to first onboarding screen
    if (isAuthenticated && isOnboarding) {
      console.log('🎯 [SignUpEmailScreen] Navigating to onboarding after successful OAuth');
      
      // Use reset to ensure clean navigation state
      setTimeout(() => {
        console.log('🎯 [SignUpEmailScreen] Executing navigation reset to onboarding');
        try {
          navigation.reset({
            index: 0,
            routes: [{ name: 'OnboardingPersonalInfoIntro' }],
          });
          console.log('✅ [SignUpEmailScreen] Navigation reset executed successfully');
        } catch (error) {
          console.error('❌ [SignUpEmailScreen] Navigation reset failed:', error);
        }
      }, 150);
    }
  }, [isAuthenticated, isOnboarding, navigation]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Please enter your email address");
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Navigate to password screen with email and name data
    navigation.navigate("SignUpPassword", { 
      email: email.trim().toLowerCase(),
      firstName,
      ...(lastName ? { lastName } : {})
    });
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithGoogle({
        firstName: firstName.trim(),
        ...(lastName ? { lastName: lastName.trim() } : {})
      });
      
      if (!result.success) {
        let errorMessage = result.error || "Please try again.";
        
        // Provide more helpful error messages for common issues
        if (result.error?.includes('sync with backend')) {
          errorMessage = "Account created but sync failed. Please try signing in again or check your internet connection.";
        } else if (result.error?.includes('Network request failed')) {
          errorMessage = "Please check your internet connection and try again.";
        }
        
        Alert.alert(
          "Google Sign-Up Failed",
          errorMessage
        );
      }
      // Navigation will be handled automatically by auth state changes
    } catch (error: any) {
      Alert.alert(
        "Google Sign-Up Failed",
        error.message || "An unexpected error occurred"
      );
    }
  };

  const handleAppleSignUp = async () => {
    try {
      const result = await signInWithApple({
        firstName: firstName.trim(),
        ...(lastName ? { lastName: lastName.trim() } : {})
      });
      
      if (!result.success) {
        let errorMessage = result.error || "Please try again.";
        
        // Provide more helpful error messages for common issues
        if (result.error?.includes('sync with backend')) {
          errorMessage = "Account created but sync failed. Please try signing in again or check your internet connection.";
        } else if (result.error?.includes('Network request failed')) {
          errorMessage = "Please check your internet connection and try again.";
        }
        
        Alert.alert(
          "Apple Sign-Up Failed",
          errorMessage
        );
      }
      // Navigation will be handled automatically by auth state changes
    } catch (error: any) {
      Alert.alert(
        "Apple Sign-Up Failed",
        error.message || "An unexpected error occurred"
      );
    }
  };

  return (
    <SafeAreaView style={[sharedStyles.screenContainer, { backgroundColor: theme.background }]}>
      {/* Header Row */}
      <View style={sharedStyles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Social Sign Up Label */}
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Sign up with:</Text>
            
            {/* Social Sign Up Buttons - Icons Only */}
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity
                style={[styles.googleButton, isAuthenticating && { opacity: 0.5 }]}
                onPress={handleGoogleSignUp}
                disabled={isAuthenticating}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={32} color="#FFFFFF" />
              </TouchableOpacity>

              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={[styles.appleButton, isAuthenticating && { opacity: 0.5 }]}
                  onPress={handleAppleSignUp}
                  disabled={isAuthenticating}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-apple" size={32} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View
                style={[
                  styles.inputContainer,
                  emailError ? styles.inputContainerError : null,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={emailError ? "#EF4444" : theme.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="your.email@example.com"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={true}
                  returnKeyType="next"
                  onSubmitEditing={handleContinue}
                />
              </View>
              {emailError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              ) : null}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: email.trim() ? theme.buttonBackground : theme.border,
                  marginTop: 40,
                },
              ]}
              disabled={!email.trim()}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={[styles.primaryButtonText, { color: email.trim() ? theme.buttonText : theme.textSecondary }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpEmailScreen;
