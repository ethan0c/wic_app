import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useScannerSettings } from '../../context/ScannerSettingsContext';
import Typography from '../../components/Typography';
import SectionCard from '../../components/home/SectionCard';

export default function ScannerSettingsScreen() {
  const { theme } = useTheme();
  const { settings, toggleAudio, setLanguage } = useScannerSettings();

  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        
        {/* Audio Settings */}
        <SectionCard title="Audio Feedback">
          <TouchableOpacity
            style={styles.settingRow}
            onPress={toggleAudio}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons 
                name="volume-high" 
                size={24} 
                color={settings.audioEnabled ? '#1A1A1A' : '#9CA3AF'} 
              />
              <View style={styles.settingText}>
                <Typography variant="body" weight="600">
                  Audio Announcements
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Hear scan results spoken aloud
                </Typography>
              </View>
            </View>
            <View style={[
              styles.toggle, 
              { backgroundColor: settings.audioEnabled ? '#1A1A1A' : '#E5E7EB' }
            ]}>
              <View style={[
                styles.toggleButton,
                { 
                  transform: [{ translateX: settings.audioEnabled ? 20 : 2 }],
                  backgroundColor: '#FFFFFF'
                }
              ]} />
            </View>
          </TouchableOpacity>
        </SectionCard>

        <View style={{ height: 12 }} />

        {/* Language Settings */}
        <SectionCard title="Language / Langaj">
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                settings.language === 'en' && styles.languageOptionActive
              ]}
              onPress={() => setLanguage('en')}
            >
              <Typography 
                variant="body" 
                weight="600" 
                style={{ 
                  color: settings.language === 'en' ? '#FFFFFF' : '#1A1A1A' 
                }}
              >
                🇺🇸 English
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                settings.language === 'ht' && styles.languageOptionActive
              ]}
              onPress={() => setLanguage('ht')}
            >
              <Typography 
                variant="body" 
                weight="600" 
                style={{ 
                  color: settings.language === 'ht' ? '#FFFFFF' : '#1A1A1A' 
                }}
              >
                🇭🇹 Kreyòl Ayisyen
              </Typography>
            </TouchableOpacity>
          </View>

          <Typography variant="caption" color="textSecondary" style={{ marginTop: 12 }}>
            Audio announcements will be spoken in your selected language
          </Typography>
        </SectionCard>

        <View style={{ height: 12 }} />

        {/* Info Section */}
        <SectionCard>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="information" size={24} color="#6B7280" />
            <View style={styles.infoText}>
              <Typography variant="body" color="textSecondary">
                These settings apply to the scanner audio feedback and language preferences. 
                Changes are saved automatically.
              </Typography>
            </View>
          </View>
        </SectionCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
  },
  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  languageOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  languageOptionActive: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
});