import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useWIC } from '../../context/WICContext';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import Typography from '../../components/Typography';

// Home Components
import HomeHeader from '../../components/home/HomeHeader';
import BenefitTilesGroup from '../../components/home/BenefitTilesGroup';
import QuickActionCard from '../../components/home/QuickActionCard';
import SmartPickItem from '../../components/home/SmartPickItem';
import BottomUtilities from '../../components/home/BottomUtilities';
import SectionCard from '../../components/home/SectionCard';
import CardDisplay from '../../components/home/CardDisplay';

type HomeScreenNavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { benefits, monthPeriod, daysRemaining } = useWIC();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // WIC benefits data for the visual dashboard
  const wicBenefits = [
    {
      key: 'milk',
      icon: 'water-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Milk',
      remaining: 3,
      total: 4,
      unit: 'gallons',
    },
    {
      key: 'produce',
      icon: 'nutrition-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Fruits & Veg',
      remaining: 18.32,
      total: 32.00,
      unit: 'dollars',
    },
    {
      key: 'grains',
      icon: 'restaurant-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Whole Grains',
      remaining: 2,
      total: 3,
      unit: 'packages',
    },
    {
      key: 'cereal',
      icon: 'cube-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Cereal',
      remaining: 45,
      total: 72,
      unit: 'ounces',
    },
  ];

  // Quick actions
  const quickActions = [
    {
      key: 'scan',
      title: 'Scan Item',
      icon: 'barcode-scan' as keyof typeof MaterialCommunityIcons.glyphMap,
      backgroundColor: '#E8F5E8',
      iconColor: '#22C55E',
      action: () => navigation.navigate('MainTabs', { screen: 'Scanner' } as any),
    },
    {
      key: 'list',
      title: 'Shopping List',
      icon: 'format-list-bulleted' as keyof typeof MaterialCommunityIcons.glyphMap,
      backgroundColor: '#FEF3C7',
      iconColor: '#F59E0B',
    },
    {
      key: 'stores',
      title: 'WIC Stores',
      icon: 'map-marker-outline' as keyof typeof MaterialCommunityIcons.glyphMap,
      backgroundColor: '#DBEAFE',
      iconColor: '#3B82F6',
    },
  ];

  // Smart picks based on remaining benefits
  const smartPicks = [
    {
      key: 'bread',
      title: 'Whole wheat bread 16oz',
      subtitle: 'Perfect for your grains allowance',
      status: 'eligible' as const,
    },
    {
      key: 'milk',
      title: 'Whole milk (½ gallon)',
      subtitle: '3 half-gallons remaining',
      status: 'eligible' as const,
    },
    {
      key: 'strawberries',
      title: 'Fresh strawberries',
      subtitle: 'Fruits/veg balance applies',
      status: 'eligible' as const,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      {/* Header - Fixed at top */}
      <View style={styles.headerSection}>
        <HomeHeader userName={user?.firstName} />
      </View>
      
      

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Current Card - Right under header */}
        <View style={styles.sectionNoPad}>
        <SectionCard style={styles.cardDisplaySection}>
          <CardDisplay cardNumber="4829" />
        </SectionCard>
      </View>
      
      {/* You Have Left This Month */}
      <View style={styles.sectionNoPad}>
        <BenefitTilesGroup
          items={wicBenefits}
          onCardPress={() => navigation.navigate('MainTabs', { screen: 'Benefits' } as any)}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionNoPad}>
        <SectionCard title="Quick Actions">
          <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.key}
              icon={action.icon}
              title={action.title}
              backgroundColor={action.backgroundColor}
              iconColor={action.iconColor}
              onPress={action.action}
            />
          ))}
          </View>
        </SectionCard>
      </View>

      {/* Smart Picks */}
      <View style={styles.sectionNoPad}>
        <SectionCard
          title="Smart Picks for You"
          subtitle="Based on what you have left, here are items that match your benefits"
        >
          <View>
          {smartPicks.map((pick) => (
            <SmartPickItem
              key={pick.key}
              title={pick.title}
              subtitle={pick.subtitle}
              status={pick.status}
            />
          ))}
          </View>
        </SectionCard>
      </View>
      
      {/* Bottom Spacing */}
      <View style={{ height: 10 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 0,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionNoPad: {
    marginBottom: 3,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  cardDisplaySection: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
