import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Milk, Apple, Wheat, Zap, List, MapPin, ReceiptText, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useWicCard } from '../../context/WicCardContext';
import { useLanguage } from '../../context/LanguageContext';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import Typography from '../../components/Typography';
import CardRequiredOverlay from '../../components/CardRequiredOverlay';
import { getUserBenefits, getUserTransactions } from '../../services/wicApi';
import type { WicBenefit, Transaction } from '../../services/wicApi';

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
  const [benefits, setBenefits] = useState<WicBenefit[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch benefits and transactions when card number is available
  useEffect(() => {
    if (cardNumber) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [cardNumber]);

  const fetchData = async () => {
    if (!cardNumber) return;
    
    setLoading(true);
    try {
      const [benefitsData, transactionsData] = await Promise.all([
        getUserBenefits(cardNumber),
        getUserTransactions(cardNumber),
      ]);
      
      // Filter to current month benefits only
      const now = new Date();
      const currentMonthPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const currentBenefits = benefitsData.filter(b => b.monthPeriod === currentMonthPeriod);
      
      setBenefits(currentBenefits);
      setTransactions(transactionsData.slice(0, 3)); // Latest 3 transactions
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map category names to icons
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dairy':
        return Milk;
      case 'fruits':
      case 'vegetables':
        return Apple;
      case 'grains':
        return Wheat;
      case 'protein':
        return Zap;
      default:
        return Zap;
    }
  };

  // Convert benefits to display format
  const wicBenefits = benefits.map(benefit => ({
    key: benefit.category.toLowerCase(),
    Icon: getCategoryIcon(benefit.category),
    title: benefit.category.charAt(0).toUpperCase() + benefit.category.slice(1),
    remaining: Number(benefit.remainingAmount),
    total: Number(benefit.totalAmount),
    unit: benefit.unit,
  }));

  // Format transaction date
  const formatTransactionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
           ' • ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
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
          {loading && cardNumber ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#6B7280" />
            </View>
          ) : transactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {transactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  {index > 0 && <View style={styles.transactionDivider} />}
                  <View style={styles.transactionItem}>
                    <View style={styles.transactionLeft}>
                      <View style={[styles.transactionIcon, { backgroundColor: '#F0FDF4' }]}>
                        <Typography style={{ fontSize: 20 }}>🛒</Typography>
                      </View>
                      <View style={styles.transactionInfo}>
                        <Typography variant="body" weight="600">
                          {transaction.store?.name || 'WIC Store'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
                          {formatTransactionDate(transaction.transactionDate)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" style={{ marginTop: 4, lineHeight: 16 }}>
                          {transaction.totalItems} {transaction.totalItems === 1 ? 'item' : 'items'} • ${Number(transaction.totalValue).toFixed(2)}
                        </Typography>
                      </View>
                    </View>
                  </View>
                </React.Fragment>
              ))}
            </View>
          ) : (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <Typography variant="body" color="textSecondary">
                No recent transactions
              </Typography>
            </View>
          )}
        </SectionCard>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 10 }} />
      </ScrollView>

      {/* Benefit Detail Modal - Disabled for now, navigate to Benefits screen instead */}
      {/* {selectedBenefit && benefitDetails[selectedBenefit as keyof typeof benefitDetails] && (
        <BenefitDetailModal
          visible={selectedBenefit !== null}
          onClose={() => setSelectedBenefit(null)}
          categoryName={benefitDetails[selectedBenefit as keyof typeof benefitDetails].categoryName}
          categoryIcon={benefitDetails[selectedBenefit as keyof typeof benefitDetails].categoryIcon}
          categoryColor={benefitDetails[selectedBenefit as keyof typeof benefitDetails].categoryColor}
          items={benefitDetails[selectedBenefit as keyof typeof benefitDetails].items}
          smartPicks={benefitDetails[selectedBenefit as keyof typeof benefitDetails].smartPicks}
        />
      )} */}

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
