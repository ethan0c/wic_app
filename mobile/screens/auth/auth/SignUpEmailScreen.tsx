import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../context/ThemeContext';
import { sharedAuthStyles } from '../../../assets/styles/sharedAuth.styles';

type SignUpEmailScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'SignUpEmail'
>;

export default function SignUpEmailScreen() {
  const navigation = useNavigation<SignUpEmailScreenNavigationProp>();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    navigation.navigate('SignUpPassword', { email });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[sharedAuthStyles.container, { backgroundColor: theme.background }]}
    >
      <View style={sharedAuthStyles.content}>
        <Text style={[sharedAuthStyles.title, { color: theme.text }]}>
          What's your email?
        </Text>
        <Text style={[sharedAuthStyles.subtitle, { color: theme.textSecondary }]}>
          We'll use this to keep your account secure
        </Text>

        <TextInput
          style={[
            sharedAuthStyles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Email address"
          placeholderTextColor={theme.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TouchableOpacity
          style={[
            sharedAuthStyles.button,
            { backgroundColor: theme.primary },
            !email.trim() && sharedAuthStyles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={!email.trim()}
        >
          <Text style={sharedAuthStyles.buttonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={sharedAuthStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[sharedAuthStyles.backButtonText, { color: theme.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
