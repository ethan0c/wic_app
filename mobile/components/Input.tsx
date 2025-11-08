import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { BORDER_RADIUS, SPACING, FONT_WEIGHTS } from '../assets/styles/shared.styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ComponentType<any>;
  isPassword?: boolean;
}

export default function Input({
  label,
  error,
  icon,
  isPassword = false,
  style,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.inputBackground,
            borderColor: error ? theme.error : theme.border,
          },
        ]}
      >
        {icon && React.createElement(icon, {
            size: 20,
            color: error ? theme.error : theme.textSecondary,
            stroke: error ? theme.error : theme.textSecondary,
            style: styles.icon
          }
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
            },
            style,
          ]}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.textSecondary} stroke={theme.textSecondary} />
            ) : (
              <Eye size={20} color={theme.textSecondary} stroke={theme.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={theme.error} stroke={theme.error} />
          <Text style={[styles.errorText, { color: theme.error }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.light,
  },
  eyeButton: {
    padding: SPACING.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  errorText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.light,
  },
});
