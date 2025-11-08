import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import WicLogo from "../../components/WicLogo";

const IntroScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("StateProvider");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <WicLogo code="US" width={200} height={200} style={styles.logoImage} />
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>Women, Infants, and Children</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoContainer: { alignItems: "center" },
  logoImage: { width: 200, height: 200, marginBottom: 24 },
  tagline: { fontSize: 16, fontWeight: '300', textAlign: 'center' },
});

export default IntroScreen;