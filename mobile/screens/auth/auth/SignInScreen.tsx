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
import { useAuth } from "../../../context/AuthContext";
import { createSharedAuthStyles } from "../../../assets/styles/sharedAuth.styles";
import { createSharedStyles } from "../../../assets/styles/shared.styles";
import { useTheme } from "../../../context/ThemeContext";

const SignInScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { signIn, isLoading } = useAuth();
  
  const styles = useMemo(() => createSharedAuthStyles(theme), [theme]);
  const sharedStyles = useMemo(() => createSharedStyles(theme), [theme]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let hasErrors = false;

    if (!email.trim()) {
      setEmailError("Please enter your email address");
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password");
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      hasErrors = true;
    }

    if (hasErrors) return;

    const result = await signIn(email.trim().toLowerCase(), password);

    if (!result.success) {
      setGeneralError(result.error || "Invalid email or password");
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignUpName");
  };

  return (
    <SafeAreaView style={[sharedStyles.screenContainer, { backgroundColor: theme.background }]}>
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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formSection}>
            <Text style={[styles.sectionLabel, { fontSize: 28, fontWeight: 'bold', color: theme.text, marginBottom: 32 }]}>
              Welcome Back
            </Text>

            {generalError ? (
              <View style={[styles.errorContainer, { marginBottom: 16 }]}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{generalError}</Text>
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
                    if (generalError) setGeneralError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
              {emailError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  passwordError ? styles.inputContainerError : null,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={passwordError ? "#EF4444" : theme.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError("");
                    if (generalError) setGeneralError("");
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{passwordError}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <Text style={styles.linkButtonText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor:
                    email && password ? theme.buttonBackground : theme.border,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              disabled={!email || !password || isLoading}
              onPress={handleSignIn}
              activeOpacity={0.8}
            >
              <Text style={[styles.primaryButtonText, { color: email && password ? theme.buttonText : theme.textSecondary }]}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Text style={styles.footerLink} onPress={navigateToSignUp}>
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
