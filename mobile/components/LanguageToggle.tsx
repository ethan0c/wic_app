import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Typography from './Typography';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Typography variant="subheading" weight="600" style={{ marginBottom: 12, color: theme.textSecondary }}>
        {t('profile.language')}
      </Typography>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            language === 'en' && { backgroundColor: theme.primary },
            { borderColor: theme.border }
          ]}
          onPress={() => setLanguage('en')}
          activeOpacity={0.7}
        >
          <Typography 
            variant="body" 
            weight="600"
            style={{ color: language === 'en' ? 'white' : theme.text }}
          >
            🇺🇸 English
          </Typography>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            language === 'ht' && { backgroundColor: theme.primary },
            { borderColor: theme.border }
          ]}
          onPress={() => setLanguage('ht')}
          activeOpacity={0.7}
        >
          <Typography 
            variant="body" 
            weight="600"
            style={{ color: language === 'ht' ? 'white' : theme.text }}
          >
            🇭🇹 Kreyòl
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
