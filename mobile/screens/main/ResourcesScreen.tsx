import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function ResourcesScreen() {
  const { theme, themeKey, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    Alert.alert(
      'Language Changed',
      `Language set to ${language === 'en' ? 'English' : 'Haitian-Creole'}. This is a prototype - full translation will be implemented.`
    );
  };

  const openMap = () => {
    Alert.alert('WIC Stores', 'Store locator will open a map with nearby WIC-approved stores.');
  };

  const openHelp = () => {
    Alert.alert('Help & Support', 'Contact WIC support or view FAQ.');
  };

  const openAbout = () => {
    Alert.alert('About WIC', 'Information about the WIC program and eligibility.');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Resources & Settings
        </Text>
      </View>

      {/* Profile Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]?.toUpperCase() || 'W'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
              {user?.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Language Selection */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Language / Lang
        </Text>
      </View>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleLanguageChange('en')}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="language" size={24} color={theme.primary} />
            <Text style={[styles.menuText, { color: theme.text }]}>English</Text>
          </View>
          {selectedLanguage === 'en' && (
            <Ionicons name="checkmark" size={24} color={theme.primary} />
          )}
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleLanguageChange('ht')}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="language" size={24} color={theme.primary} />
            <Text style={[styles.menuText, { color: theme.text }]}>Kreyòl Ayisyen</Text>
          </View>
          {selectedLanguage === 'ht' && (
            <Ionicons name="checkmark" size={24} color={theme.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Appearance */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Appearance
        </Text>
      </View>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons
              name={themeKey === 'dark' ? 'moon' : 'sunny'}
              size={24}
              color={theme.primary}
            />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={themeKey === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary + '80' }}
            thumbColor={themeKey === 'dark' ? theme.primary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Quick Access
        </Text>
      </View>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <TouchableOpacity style={styles.menuItem} onPress={openMap}>
          <View style={styles.menuLeft}>
            <Ionicons name="map" size={24} color={theme.primary} />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Find WIC Stores
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity style={styles.menuItem} onPress={openHelp}>
          <View style={styles.menuLeft}>
            <Ionicons name="help-circle" size={24} color={theme.primary} />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Help & Support
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity style={styles.menuItem} onPress={openAbout}>
          <View style={styles.menuLeft}>
            <Ionicons name="information-circle" size={24} color={theme.primary} />
            <Text style={[styles.menuText, { color: theme.text }]}>
              About WIC
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: theme.error + '20' }]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out" size={24} color={theme.error} />
        <Text style={[styles.signOutText, { color: theme.error }]}>
          Sign Out
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  section: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '400',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 26,
    fontWeight: '300',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 19,
    fontWeight: '400',
    marginBottom: 3,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '300',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    marginLeft: 52,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 24,
    gap: 10,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '400',
  },
  bottomPadding: {
    height: 40,
  },
});
