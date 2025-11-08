import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  // Mock data - will be replaced with actual data later
  const benefitsRemaining = {
    milk: { used: 2, total: 4, unit: 'gallons' },
    cereal: { used: 1, total: 2, unit: 'boxes' },
    eggs: { used: 0, total: 1, unit: 'dozen' },
    bread: { used: 1, total: 2, unit: 'loaves' },
    peanutButter: { used: 0, total: 1, unit: 'jar' },
  };

  const daysRemaining = 15;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.name, { color: theme.text }]}>
            {user?.firstName || 'WIC Participant'}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.badgeText, { color: theme.primary }]}>
            {daysRemaining} days left
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Quick Scan
        </Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          Scan items while shopping to check eligibility
        </Text>
        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="scan" size={24} color="white" />
          <Text style={styles.scanButtonText}>Start Scanning</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Benefits Overview
      </Text>

      {Object.entries(benefitsRemaining).map(([key, benefit]) => {
        const percentage = (benefit.used / benefit.total) * 100;
        const remaining = benefit.total - benefit.used;

        return (
          <View
            key={key}
            style={[styles.benefitCard, { backgroundColor: theme.card }]}
          >
            <View style={styles.benefitHeader}>
              <Text style={[styles.benefitName, { color: theme.text }]}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </Text>
              <Text style={[styles.benefitRemaining, { color: theme.primary }]}>
                {remaining} {benefit.unit} left
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${percentage}%`,
                    backgroundColor: percentage >= 75 ? theme.error : theme.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.benefitUsed, { color: theme.textSecondary }]}>
              Used {benefit.used} of {benefit.total} {benefit.unit}
            </Text>
          </View>
        );
      })}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '300',
  },
  name: {
    fontSize: 28,
    fontWeight: '300',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '400',
  },
  card: {
    margin: 20,
    marginTop: 10,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '400',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: '300',
    marginBottom: 20,
    lineHeight: 22,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 30,
    gap: 10,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  benefitCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 18,
    borderRadius: 20,
  },
  benefitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitName: {
    fontSize: 16,
    fontWeight: '400',
  },
  benefitRemaining: {
    fontSize: 14,
    fontWeight: '400',
  },
  progressBar: {
    height: 6,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  benefitUsed: {
    fontSize: 13,
    fontWeight: '300',
  },
  bottomPadding: {
    height: 20,
  },
});
