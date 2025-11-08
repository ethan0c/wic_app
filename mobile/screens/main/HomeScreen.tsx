import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useWIC } from '../../context/WICContext';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import Typography from '../../components/Typography';

type HomeScreenNavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { benefits, monthPeriod, daysRemaining } = useWIC();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Mock WIC benefits data for the visual dashboard
  const wicBenefits = [
    {
      key: 'milk',
      icon: 'water-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Milk',
      remaining: 3,
      total: 4,
      unit: 'gallons',
      backgroundColor: '#E3F2FD',
      iconColor: '#1976D2',
    },
    {
      key: 'produce',
      icon: 'nutrition-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Fruits & Veg',
      remaining: 18.32,
      total: 32.00,
      unit: 'dollars',
      backgroundColor: '#E8F5E8',
      iconColor: '#2E7D32',
    },
    {
      key: 'grains',
      icon: 'restaurant-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Whole Grains',
      remaining: 2,
      total: 3,
      unit: 'packages',
      backgroundColor: '#FFF3E0',
      iconColor: '#F57C00',
    },
    {
      key: 'cereal',
      icon: 'cube-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Cereal',
      remaining: 45,
      total: 72,
      unit: 'ounces',
      backgroundColor: '#F3E5F5',
      iconColor: '#7B1FA2',
    },
  ];

  // Quick actions
  const quickActions = [
    {
      key: 'scan',
      title: 'Scan Item',
      icon: 'scan-outline' as keyof typeof Ionicons.glyphMap,
      backgroundColor: '#FFE5E5',
      iconColor: '#D32F2F',
      action: () => navigation.navigate('MainTabs', { screen: 'Scanner' } as any),
    },
    {
      key: 'list',
      title: 'Shopping List',
      icon: 'list-outline' as keyof typeof Ionicons.glyphMap,
      backgroundColor: '#E5F3FF',
      iconColor: '#1976D2',
    },
    {
      key: 'stores',
      title: 'WIC Stores',
      icon: 'location-outline' as keyof typeof Ionicons.glyphMap,
      backgroundColor: '#E8F5E8',
      iconColor: '#2E7D32',
    },
  ];

  // Smart picks based on remaining benefits
  const smartPicks = [
    {
      key: 'bread',
      title: 'Whole wheat bread 16oz',
      subtitle: 'Perfect for your grains allowance',
      status: 'eligible',
    },
    {
      key: 'milk',
      title: 'Whole milk (½ gallon)',
      subtitle: '3 half-gallons remaining',
      status: 'eligible',
    },
    {
      key: 'strawberries',
      title: 'Fresh strawberries',
      subtitle: 'Fruits/veg balance applies',
      status: 'eligible',
    },
  ];

  const renderProgressBar = (remaining: number, total: number) => {
    const usedPercentage = ((total - remaining) / total) * 100;
    const segments = Array.from({ length: 9 }, (_, i) => {
      const segmentPercentage = ((i + 1) / 9) * 100;
      return segmentPercentage <= (100 - usedPercentage);
    });

    return (
      <View style={styles.progressContainer}>
        {segments.map((filled, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              {
                backgroundColor: filled ? theme.primary : theme.border,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Typography variant="heading" weight="700" style={{ fontSize: 28 }}>
            Good morning, {user?.firstName || 'Maria'}! 👋
          </Typography>
          <Typography variant="body" color="textSecondary" style={{ marginTop: 4 }}>
            You're doing great this month
          </Typography>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
            <Typography variant="label" style={{ color: theme.primary }}>
              {daysRemaining} days left
            </Typography>
          </View>
          
          <TouchableOpacity 
            style={[styles.bellButton, { backgroundColor: theme.card }]}
            onPress={() => {
              // Navigate to announcements or show modal
            }}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.text} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Benefits Summary */}
      <View style={styles.section}>
        <Typography variant="title" weight="600" style={{ marginBottom: 16 }}>
          You Have Left This Month
        </Typography>
        
        <View style={styles.benefitsGrid}>
          {wicBenefits.map((benefit) => (
            <TouchableOpacity
              key={benefit.key}
              style={[styles.benefitTile, { backgroundColor: benefit.backgroundColor }]}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Benefits' } as any)}
              activeOpacity={0.8}
            >
              <View style={styles.benefitHeader}>
                <Ionicons name={benefit.icon} size={24} color={benefit.iconColor} />
                <Typography variant="body" weight="600" style={{ color: benefit.iconColor }}>
                  {benefit.title}
                </Typography>
              </View>
              
              <Typography variant="title" weight="700" style={{ color: benefit.iconColor, marginVertical: 8 }}>
                {benefit.unit === 'dollars' ? `$${benefit.remaining.toFixed(2)}` : benefit.remaining} {benefit.unit === 'dollars' ? '' : benefit.unit}
              </Typography>
              
              {renderProgressBar(benefit.remaining, benefit.total)}
              
              <Typography variant="caption" style={{ color: benefit.iconColor, opacity: 0.8, marginTop: 4 }}>
                of {benefit.unit === 'dollars' ? `$${benefit.total.toFixed(2)}` : `${benefit.total} ${benefit.unit}`}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Typography variant="title" weight="600" style={{ marginBottom: 16 }}>
          Quick Actions
        </Typography>
        
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={[styles.actionCard, { backgroundColor: action.backgroundColor }]}
              onPress={action.action}
              activeOpacity={0.8}
            >
              <Ionicons name={action.icon} size={32} color={action.iconColor} />
              <Typography variant="body" weight="600" style={{ color: action.iconColor, marginTop: 8 }}>
                {action.title}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Smart Picks */}
      <View style={styles.section}>
        <Typography variant="title" weight="600" style={{ marginBottom: 8 }}>
          Smart Picks for You
        </Typography>
        <Typography variant="body" color="textSecondary" style={{ marginBottom: 16 }}>
          Based on what you have left, here are items that match your benefits
        </Typography>
        
        <View style={styles.smartPicksList}>
          {smartPicks.map((pick) => (
            <View key={pick.key} style={[styles.smartPickCard, { backgroundColor: theme.card }]}>
              <View style={styles.smartPickContent}>
                <View style={styles.smartPickText}>
                  <Typography variant="body" weight="600" style={{ marginBottom: 2 }}>
                    {pick.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {pick.subtitle}
                  </Typography>
                </View>
                <View style={[styles.eligibleBadge, { backgroundColor: '#10B98115' }]}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Typography variant="caption" style={{ color: '#10B981', marginLeft: 4 }}>
                    Eligible
                  </Typography>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  benefitTile: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  smartPicksList: {
    gap: 12,
  },
  smartPickCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  smartPickContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smartPickText: {
    flex: 1,
  },
  eligibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
