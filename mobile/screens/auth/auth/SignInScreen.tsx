import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { Button, Input, Typography } from "../../../components";
import { SPACING } from "../../../assets/styles/shared.styles";

const SignInScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignIn = async () => {
    setEmailError("");
    setPasswordError("");

    // For now, allow any input to sign in
    if (!email.trim()) {
      setEmailError("Please enter your email address");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password");
      return;
    }

    // Allow sign in with any credentials for prototype
    await signIn(email.trim().toLowerCase(), password);
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignUpName");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: SPACING.lg }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: SPACING.lg, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginTop: SPACING.xl }}>
            <Typography variant="heading" align="center" style={{ marginBottom: 32 }}>
              Welcome Back
            </Typography>

            <Input
              label="Email"
              icon="mail-outline"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              icon="lock-closed-outline"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              isPassword
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={{ alignSelf: 'flex-start', marginBottom: SPACING.lg }}
            >
              <Typography color="primary">Forgot Password?</Typography>
            </TouchableOpacity>

            <Button
              title={isLoading ? "Signing In..." : "Sign In"}
              onPress={handleSignIn}
              loading={isLoading}
              disabled={!email.trim() || !password.trim()}
              fullWidth
              size="large"
              style={{ marginTop: SPACING.md }}
            />

            <View style={{ marginTop: SPACING.xl, alignItems: 'center' }}>
              <Typography color="textSecondary">
                Don't have an account?{' '}
              </Typography>
              <TouchableOpacity onPress={navigateToSignUp}>
                <Typography color="primary">Sign Up</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
