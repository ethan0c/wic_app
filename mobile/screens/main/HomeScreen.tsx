import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Milk, Apple, Wheat, Zap, List, MapPin, ReceiptText, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useWicCard } from '../../context/WicCardContext';
import { useLanguage } from '../../context/LanguageContext';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import Typography from '../../components/Typography';
import CardRequiredOverlay from '../../components/CardRequiredOverlay';

// Home Components
import HomeHeader from '../../components/home/HomeHeader';
import BenefitTilesGroup from '../../components/home/BenefitTilesGroup';
import QuickActionCard from '../../components/home/QuickActionCard';
import SectionCard from '../../components/home/SectionCard';
import BenefitDetailModal from '../../components/home/BenefitDetailModal';

type HomeScreenNavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function HomeScreen() {
  const { theme } = useTheme();
  const { cardNumber } = useWicCard();
  const { t } = useLanguage();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);

  // WIC benefits data for the visual dashboard
  const wicBenefits = [
    {
      key: 'milk',
      Icon: Milk,
      title: t('home.milk'),
      remaining: 3,
      total: 4,
      unit: t('home.gallons'),
    },
    {
      key: 'produce',
      Icon: Apple,
      title: t('home.fruitsVeg'),
      remaining: 18.32,
      total: 32.00,
      unit: t('home.dollars'),
    },
    {
      key: 'grains',
      Icon: Wheat,
      title: t('home.wholeGrains'),
      remaining: 2,
      total: 3,
      unit: t('home.packages'),
    },
    {
      key: 'cereal',
      Icon: Zap,
      title: t('home.cereal'),
      remaining: 45,
      total: 72,
      unit: t('home.ounces'),
    },
  ];

  // Detailed breakdown for each benefit category
  const benefitDetails = {
    milk: {
      categoryName: t('categories.milk'),
      categoryIcon: 'Milk' as const,
      categoryColor: '#E3F2FD',
      items: [
        { id: '1', name: 'Whole Milk', quantity: '1 gallon', unit: 'gallons', used: 1, total: 4, icon: 'Milk' as const, suggestion: '1 gallon = 16 cups' },
        { id: '2', name: 'Low-fat Yogurt', quantity: '32 oz', unit: 'oz', used: 16, total: 32, icon: 'Package2' as const, suggestion: '32 oz ≈ one large container' },
        { id: '3', name: 'Cheese', quantity: '1 lb', unit: 'lb', used: 0, total: 1, icon: 'Package2' as const, suggestion: '1 lb = 16 oz block or shredded' },
      ],
      smartPicks: [
        { id: '1', title: 'Whole milk (½ gallon)', subtitle: '3 half-gallons remaining' },
        { id: '2', title: 'Low-fat vanilla yogurt 32oz' },
      ],
    },
    produce: {
      categoryName: t('categories.produce'),
      categoryIcon: 'Apple' as const,
      categoryColor: '#FFEBEE',
      items: [
        { id: '1', name: 'Fresh Fruits', quantity: 'Any fresh', unit: 'dollars', used: 8.50, total: 16.00, icon: 'Apple' as const, suggestion: '$16 ≈ 4-5 lbs at avg price' },
        { id: '2', name: 'Fresh Vegetables', quantity: 'Any fresh', unit: 'dollars', used: 5.18, total: 16.00, icon: 'Carrot' as const, suggestion: '$16 ≈ 5-6 lbs at avg price' },
      ],
      smartPicks: [
        { id: '1', title: 'Fresh strawberries', subtitle: 'In season now' },
        { id: '2', title: 'Baby carrots 1lb bag' },
        { id: '3', title: 'Bananas', subtitle: 'Great value' },
      ],
    },
    grains: {
      categoryName: t('categories.grains'),
      categoryIcon: 'Wheat' as const,
      categoryColor: '#FFF3E0',
      items: [
        { id: '1', name: 'Whole Wheat Bread', quantity: '16 oz', unit: 'loaves', used: 1, total: 2, icon: 'Sandwich' as const, suggestion: '16 oz = standard loaf' },
        { id: '2', name: 'Brown Rice', quantity: '1 lb', unit: 'packages', used: 0, total: 1, icon: 'Wheat' as const, suggestion: '1 lb ≈ 2.5 cups uncooked' },
      ],
      smartPicks: [
        { id: '1', title: 'Whole wheat bread 16oz', subtitle: '1 loaf remaining' },
        { id: '2', title: 'Brown rice 1lb' },
      ],
    },
    cereal: {
      categoryName: t('categories.cereal'),
      categoryIcon: 'Zap' as const,
      categoryColor: '#FCE4EC',
      items: [
        { id: '1', name: 'Whole Grain Cereal', quantity: '36 oz', unit: 'oz', used: 27, total: 72, icon: 'Package2' as const, suggestion: '36 oz ≈ two 18-oz boxes' },
      ],
      smartPicks: [
        { id: '1', title: 'Cheerios 18oz', subtitle: '45 oz remaining' },
        { id: '2', title: 'Whole grain oatmeal' },
      ],
    },
  };

  // Quick actions
  const quickActions = [
    {
      key: 'list',
      title: t('home.shoppingList'),
      Icon: List,
      backgroundColor: '#FEF3C7',
      iconColor: '#F59E0B',
      action: () => navigation.navigate('ShoppingList'),
    },
    {
      key: 'stores',
      title: t('home.wicStores'),
      Icon: MapPin,
      backgroundColor: '#DBEAFE',
      iconColor: '#3B82F6',
      action: () => navigation.navigate('WICStores'),
    },
    {
      key: 'receipt',
      title: t('home.showCashier'),
      Icon: ReceiptText,
      backgroundColor: '#F3E8FF',
      iconColor: '#A855F7',
      action: () => navigation.navigate('ShowCashier'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      {/* Header - Fixed at top */}
      <View style={styles.headerSection}>
        <HomeHeader />
      </View>
      
      

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
      {/* You Have Left This Month */}
      <View style={styles.sectionNoPad}>
        <SectionCard title={t('home.leftThisMonth')}>
        <BenefitTilesGroup
          items={wicBenefits}
          onCardPress={(key) => setSelectedBenefit(key)}
        />
        </SectionCard>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionNoPad}>
        <SectionCard title={t('home.quickActions')}>
          <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.key}
              Icon={action.Icon}
              title={action.title}
              backgroundColor={action.backgroundColor}
              iconColor={action.iconColor}
              onPress={action.action}
            />
          ))}
          </View>
        </SectionCard>
      </View>

      {/* Recent Transactions */}
      <View style={styles.sectionNoPad}>
        <SectionCard 
          title={t('home.recentTransactions')}
          right={
            <TouchableOpacity 
              style={styles.addPurchaseButton}
              onPress={() => navigation.navigate('PurchaseConfirmation')}
              activeOpacity={0.7}
            >
              <Plus size={18} color="#10B981" strokeWidth={2.5} />
              <Typography variant="caption" weight="600" style={{ color: '#10B981', marginLeft: 4 }}>
                {t('home.addPurchase')}
              </Typography>
            </TouchableOpacity>
          }
        >
          <View style={styles.transactionsList}>
            <View style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: '#F0FDF4' }]}>
                  <Typography style={{ fontSize: 20 }}>🛒</Typography>
                </View>
                <View style={styles.transactionInfo}>
                  <Typography variant="body" weight="600">
                    Walmart Supercenter
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
                    Nov 6, 2025 • 3:42 PM
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 4, lineHeight: 16 }}>
                    2 gal whole milk, 1 lb cheese, 2 lbs apples
                  </Typography>
                </View>
              </View>
            </View>

            <View style={styles.transactionDivider} />

            <View style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: '#F0FDF4' }]}>
                  <Typography style={{ fontSize: 20 }}>🛒</Typography>
                </View>
                <View style={styles.transactionInfo}>
                  <Typography variant="body" weight="600">
                    Target
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
                    Nov 3, 2025 • 10:15 AM
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 4, lineHeight: 16 }}>
                    1 gal milk, 32 oz yogurt, 3 lbs strawberries
                  </Typography>
                </View>
              </View>
            </View>

            <View style={styles.transactionDivider} />

            <View style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Typography style={{ fontSize: 20 }}>💳</Typography>
                </View>
                <View style={styles.transactionInfo}>
                  <Typography variant="body" weight="600">
                    Monthly Benefits Reset
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
                    Nov 1, 2025 • 12:00 AM
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 4, lineHeight: 16 }}>
                    All benefits renewed for November
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        </SectionCard>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 10 }} />
      </ScrollView>

      {/* Benefit Detail Modal */}
      {selectedBenefit && benefitDetails[selectedBenefit as keyof typeof benefitDetails] && (
        <BenefitDetailModal
          visible={selectedBenefit !== null}
          onClose={() => setSelectedBenefit(null)}
          categoryName={benefitDetails[selectedBenefit as keyof typeof benefitDetails].categoryName}
          categoryIcon={benefitDetails[selectedBenefit as keyof typeof benefitDetails].categoryIcon}
          categoryColor={benefitDetails[selectedBenefit as keyof typeof benefitDetails].categoryColor}
          items={benefitDetails[selectedBenefit as keyof typeof benefitDetails].items}
          smartPicks={benefitDetails[selectedBenefit as keyof typeof benefitDetails].smartPicks}
        />
      )}

      {/* Card Required Overlay - shown when no card number - rendered LAST so it's on top */}
      {!cardNumber && (
        <CardRequiredOverlay message="Enter your WIC card number to view your dashboard, benefits, and personalized information" />
      )}
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
    flexWrap: 'wrap',
    gap: 16,
  },
  transactionsList: {
    gap: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  addPurchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    gap: 4,
  },
});
