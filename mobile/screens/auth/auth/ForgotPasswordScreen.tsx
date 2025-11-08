import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createSharedAuthStyles } from "../../../assets/styles/sharedAuth.styles";
import { createSharedStyles } from "../../../assets/styles/shared.styles";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";

const ForgotPasswordScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { resetPassword, isLoading } = useAuth();
  
  const styles = useMemo(() => createSharedAuthStyles(theme), [theme]);
  const sharedStyles = useMemo(() => createSharedStyles(theme), [theme]);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    setEmailError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setEmailError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const result = await resetPassword(email.trim().toLowerCase());

    if (result.success) {
      setSuccessMessage(
        "If an account with this email exists, you will receive a password reset link shortly."
      );
    } else {
      setEmailError(result.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={[sharedStyles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={sharedStyles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formSection}>
            <Text style={[sharedStyles.heading, sharedStyles.centerText]}>
              Reset Password
            </Text>
            <Text style={[sharedStyles.secondaryText, sharedStyles.centerText, { marginBottom: 32 }]}>
              Enter your email and we'll send you a link to reset your password
            </Text>

            {successMessage ? (
              <View style={[{ marginBottom: 16, padding: 12, backgroundColor: theme.success + '20', borderRadius: 8, flexDirection: 'row', alignItems: 'center' }]}>
                <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                <Text style={{ marginLeft: 8, fontSize: 14, color: theme.success }}>{successMessage}</Text>
              </View>
            ) : null}

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
                  placeholder="Enter your email"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError("");
                    if (successMessage) setSuccessMessage("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleResetPassword}
                />
              </View>
              {emailError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: email ? theme.buttonBackground : theme.border,
                  opacity: isLoading ? 0.7 : 1,
                  marginTop: 40,
                },
              ]}
              onPress={handleResetPassword}
              disabled={!email || isLoading}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.primaryButtonText, { color: email ? theme.buttonText : theme.textSecondary }]}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Remember your password?{" "}
              <Text style={styles.footerLink} onPress={() => navigation.goBack()}>
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
