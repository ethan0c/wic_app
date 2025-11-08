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

const SignUpNameScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  
  const styles = useMemo(() => createSharedAuthStyles(theme), [theme]);
  const sharedStyles = useMemo(() => createSharedStyles(theme), [theme]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const handleContinue = () => {
    setFirstNameError("");

    if (!firstName.trim()) {
      setFirstNameError("Please enter your first name");
      return;
    }

    navigation.navigate("SignUpEmail", { 
      firstName: firstName.trim(),
      ...(lastName.trim() ? { lastName: lastName.trim() } : {})
    });
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
              What's your name?
            </Text>
            <Text style={[sharedStyles.secondaryText, sharedStyles.centerText, { marginBottom: 32 }]}>
              Let's get started with your WIC account
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <View
                style={[
                  styles.inputContainer,
                  firstNameError ? styles.inputContainerError : null,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={firstNameError ? "#EF4444" : theme.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="First name"
                  placeholderTextColor={theme.textSecondary}
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (firstNameError) setFirstNameError("");
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus={true}
                  returnKeyType="next"
                />
              </View>
              {firstNameError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{firstNameError}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name (Optional)</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Last name"
                  placeholderTextColor={theme.textSecondary}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: firstName.trim() ? theme.buttonBackground : theme.border,
                  marginTop: 40,
                },
              ]}
              disabled={!firstName.trim()}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={[styles.primaryButtonText, { color: firstName.trim() ? theme.buttonText : theme.textSecondary }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpNameScreen;
