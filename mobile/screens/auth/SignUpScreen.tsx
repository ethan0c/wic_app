// Simplified optional sign-up screen: provides context and lets user proceed to card/state flow.
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const SignUpScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Optional Account</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>Creating an account later can let you save preferences, enable a quick PIN, and sync across devices. You can skip this for now and still use your WIC card immediately.</Text>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("StateProvider")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Continue with Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.border }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 32, justifyContent: "center", gap: 28 },
  title: { fontSize: 28, fontWeight: "600", letterSpacing: -0.5 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  primaryButton: { paddingVertical: 16, borderRadius: 999, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  secondaryButton: { paddingVertical: 14, borderRadius: 999, alignItems: "center", borderWidth: 1 },
  secondaryButtonText: { fontSize: 15, fontWeight: "400" }
});

export default SignUpScreen;
