import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
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
          <Image 
            source={require('../../../assets/images/wic_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
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
  logoImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
  },
});

export default IntroScreen;
