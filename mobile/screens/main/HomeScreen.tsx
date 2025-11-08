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
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  benefitCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  benefitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitName: {
    fontSize: 16,
    fontWeight: '600',
  },
  benefitRemaining: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  benefitUsed: {
    fontSize: 12,
  },
  bottomPadding: {
    height: 20,
  },
});
