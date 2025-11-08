import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../context/ThemeContext';
import { sharedAuthStyles } from '../../../assets/styles/sharedAuth.styles';
import { Button, Input, Typography } from '../../../components';

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
        <Typography variant="heading" align="center">
          What's your email?
        </Typography>
        <Typography variant="body" color="textSecondary" align="center" style={{ marginBottom: 32 }}>
          We'll use this to keep your account secure
        </Typography>

        <Input
          icon="mail-outline"
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Button
          title="Next"
          onPress={handleNext}
          disabled={!email.trim()}
          fullWidth
        />

        <TouchableOpacity
          style={sharedAuthStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Typography color="primary">← Back</Typography>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
