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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { createSharedAuthStyles } from "../../../assets/styles/sharedAuth.styles";
import { createSharedStyles } from "../../../assets/styles/shared.styles";
import { useTheme } from "../../../context/ThemeContext";

const SignUpPasswordScreen = ({ route, navigation }: any) => {
  const { email, firstName, lastName } = route.params;
  const { theme } = useTheme();
  const { signUp, isLoading } = useAuth();
  
  const styles = useMemo(() => createSharedAuthStyles(theme), [theme]);
  const sharedStyles = useMemo(() => createSharedStyles(theme), [theme]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSignUp = async () => {
    setPasswordError("");
    setConfirmPasswordError("");

    let hasErrors = false;

    if (!password.trim()) {
      setPasswordError("Please enter a password");
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      hasErrors = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasErrors = true;
    }

    if (hasErrors) return;

    const result = await signUp(email, password, firstName, lastName);

    if (result.success) {
      Alert.alert(
        "Success!",
        "Your WIC account has been created successfully.",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Sign Up Failed",
        result.error || "An error occurred during sign up"
      );
    }
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
            <Text style={[sharedStyles.heading, sharedStyles.centerText]}>
              Create a password
            </Text>
            <Text style={[sharedStyles.secondaryText, sharedStyles.centerText, { marginBottom: 32 }]}>
              Choose a secure password for your account
            </Text>

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
                  placeholder="Enter password"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError("");
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoFocus={true}
                  returnKeyType="next"
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

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  confirmPasswordError ? styles.inputContainerError : null,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={confirmPasswordError ? "#EF4444" : theme.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm password"
                  placeholderTextColor={theme.textSecondary}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) setConfirmPasswordError("");
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: password && confirmPassword ? theme.buttonBackground : theme.border,
                  marginTop: 40,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              disabled={!password || !confirmPassword || isLoading}
              onPress={handleSignUp}
              activeOpacity={0.8}
            >
              <Text style={[styles.primaryButtonText, { color: password && confirmPassword ? theme.buttonText : theme.textSecondary }]}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpPasswordScreen;
