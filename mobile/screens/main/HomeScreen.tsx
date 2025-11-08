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
import { useWIC } from '../../context/WICContext';
import { createSharedStyles } from '../../assets/styles/shared.styles';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { benefits, monthPeriod, daysRemaining } = useWIC();
  const sharedStyles = createSharedStyles(theme);

  // Calculate total cash value from all benefits
  const totalCashValue = benefits
    .filter(b => b.unit === 'Cash Value Benefit')
    .reduce((sum, b) => sum + (b.amount - b.used), 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[sharedStyles.secondaryText]}>
            {monthPeriod}
          </Text>
          <Text style={[sharedStyles.heading, { marginTop: 4 }]}>
            {user?.firstName || 'WIC Participant'}
          </Text>
        </View>
        <View>
          <View style={[styles.badge, { backgroundColor: theme.primary + '20', marginBottom: 8 }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>
              {daysRemaining} days left
            </Text>
          </View>
          {totalCashValue > 0 && (
            <View style={[styles.badge, { backgroundColor: '#10B98120' }]}>
              <Text style={[styles.badgeText, { color: '#10B981', fontWeight: '500' }]}>
                ${totalCashValue} CVB
              </Text>
            </View>
          )}
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

      {benefits.map((benefit) => {
        const percentage = (benefit.used / benefit.amount) * 100;
        const remaining = benefit.amount - benefit.used;
        const isCashValue = benefit.unit === 'Cash Value Benefit';

        return (
          <View
            key={benefit.name}
            style={[styles.benefitCard, { backgroundColor: theme.card }]}
          >
            <View style={styles.benefitHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.benefitName, { color: theme.text }]}>
                  {benefit.name}
                </Text>
                {benefit.notes && (
                  <Text style={[styles.benefitNotes, { color: theme.textSecondary }]}>
                    {benefit.notes}
                  </Text>
                )}
              </View>
              <Text style={[styles.benefitRemaining, { color: isCashValue ? '#10B981' : theme.primary }]}>
                {isCashValue ? `$${remaining}` : `${remaining} ${benefit.unit}`}
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
              {isCashValue 
                ? `Used $${benefit.used} of $${benefit.amount}` 
                : `Used ${benefit.used} of ${benefit.amount} ${benefit.unit.toLowerCase()}`}
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
  benefitNotes: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 4,
    lineHeight: 16,
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
