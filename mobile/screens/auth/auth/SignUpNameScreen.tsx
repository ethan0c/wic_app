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
import { useTheme } from "../../../context/ThemeContext";
import { Button, Input, Typography } from "../../../components";
import { SPACING } from "../../../assets/styles/shared.styles";

const SignUpNameScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

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
            <Typography variant="heading" align="center">
              What's your name?
            </Typography>
            <Typography variant="body" color="textSecondary" align="center" style={{ marginBottom: 32 }}>
              Let's get started with your WIC account
            </Typography>

            <Input
              label="First Name"
              icon="person-outline"
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              error={firstNameError}
              autoCapitalize="words"
              autoFocus
            />

            <Input
              label="Last Name (Optional)"
              icon="person-outline"
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!firstName.trim()}
              fullWidth
              size="large"
              style={{ marginTop: SPACING.xl }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpNameScreen;
