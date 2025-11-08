import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";

const IntroScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Auto-navigate to AuthIndex after showing app name
    const timer = setTimeout(() => {
      navigation.replace("AuthIndex");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, { color: theme.primary }]}>WIC</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Women, Infants, and Children
          </Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default IntroScreen;
