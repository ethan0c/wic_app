import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { 
  Milk, Wheat, Egg, Apple, Carrot, AlertCircle, 
  Sandwich, Soup, Beef, Bean, Leaf, Package2, CupSoda, CreditCard
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWicCard } from '../../context/WicCardContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import Typography from '../../components/Typography';
import CardRequiredOverlay from '../../components/CardRequiredOverlay';
import BenefitsHeader from '../../components/benefits/BenefitsHeader';

// Mock WIC benefits data with more realistic items
const mockBenefits = {
  dairy: {
    icon: Milk,
    color: '#E3F2FD',
    items: [
      { id: '1', name: 'Milk (Whole)', quantity: 4, unit: 'gallons', used: 1, suggestion: '≈ three 1-gallon jugs', icon: Milk },
      { id: '2', name: 'Cheese', quantity: 16, unit: 'oz', used: 0, suggestion: '≈ one 1-lb block', icon: Package2 },
      { id: '3', name: 'Yogurt', quantity: 32, unit: 'oz', used: 16, suggestion: '≈ two 16-oz tubs', icon: CupSoda },
    ],
  },
  grains: {
    icon: Wheat,
    color: '#FFF3E0',
    items: [
      { id: '4', name: 'Whole Wheat Bread', quantity: 2, unit: 'loaves', used: 1, suggestion: '≈ one 24-oz loaf', icon: Sandwich },
      { id: '5', name: 'Cereal', quantity: 36, unit: 'oz', used: 18, suggestion: '≈ one 18-oz box', icon: Package2 },
      { id: '6', name: 'Brown Rice', quantity: 32, unit: 'oz', used: 0, suggestion: '≈ one 2-lb bag', icon: Wheat },
    ],
  },
  protein: {
    icon: Egg,
    color: '#FCE4EC',
    items: [
      { id: '7', name: 'Eggs', quantity: 2, unit: 'dozen', used: 1, suggestion: '≈ one 12-count carton', icon: Egg },
      { id: '8', name: 'Peanut Butter', quantity: 18, unit: 'oz', used: 0, suggestion: '≈ one standard jar', icon: Package2 },
      { id: '9', name: 'Dried Beans', quantity: 16, unit: 'oz', used: 0, suggestion: '≈ one 1-lb bag', icon: Bean },
    ],
  },
  vegetables: {
    icon: Carrot,
    color: '#E8F5E9',
    items: [
      { id: '10', name: 'Fresh Vegetables', quantity: 12.00, unit: 'dollars', used: 4.50, suggestion: '≈ $7.50 to spend', icon: Leaf },
      { id: '11', name: 'Carrots', quantity: 2, unit: 'lbs', used: 1, suggestion: '≈ one 1-lb bag', icon: Carrot },
      { id: '12', name: 'Canned Vegetables', quantity: 4, unit: 'cans', used: 0, suggestion: '≈ four 15-oz cans', icon: Soup },
    ],
  },
  fruits: {
    icon: Apple,
    color: '#FFEBEE',
    items: [
      { id: '13', name: 'Fresh Fruit', quantity: 11.00, unit: 'dollars', used: 3.50, suggestion: '≈ $7.50 to spend', icon: Apple },
      { id: '14', name: 'Apples', quantity: 3, unit: 'lbs', used: 0, suggestion: '≈ 8-10 medium apples', icon: Apple },
      { id: '15', name: '100% Juice', quantity: 128, unit: 'fl oz', used: 64, suggestion: '≈ one 64-oz bottle', icon: CupSoda },
    ],
  },
};

type CategoryKey = keyof typeof mockBenefits;
type NavigationProp = StackNavigationProp<MainNavigatorParamList>;

export default function BenefitsScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { cardNumber } = useWicCard();
  const navigation = useNavigation<NavigationProp>();
  const [expandedCategory, setExpandedCategory] = useState<CategoryKey | null>('dairy');
  const [viewMode, setViewMode] = useState<'current' | 'future'>('current');

  // Calculate current month's expiration date (last day of current month)
  const today = new Date();
  const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysUntilExpiration = Math.ceil((currentMonthEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Format expiration date
  const expirationDateString = currentMonthEnd.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Next month's start date for future benefits
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthStartString = nextMonthStart.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Determine color based on days remaining
  const getExpirationStyle = () => {
    if (daysUntilExpiration < 10) {
      return {
        backgroundColor: '#FEE2E2',
        textColor: '#DC2626',
        iconColor: '#DC2626',
      };
    } else if (daysUntilExpiration < 20) {
      return {
        backgroundColor: '#FEF3C7',
        textColor: '#D97706',
        iconColor: '#D97706',
      };
    } else {
      return {
        backgroundColor: '#E0F2FE',
        textColor: '#0369A1',
        iconColor: '#0369A1',
      };
    }
  };

  const expirationStyle = getExpirationStyle();

  // No need for auto-prompt - overlay handles it now

  const toggleCategory = (category: CategoryKey) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getCategoryTitle = (category: CategoryKey) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'dollars') {
      return `$${value.toFixed(2)}`;
    }
    return `${value} ${unit}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      {/* Custom Header with Card Management */}
      <BenefitsHeader />

      {/* Toggle between Current and Future */}
      <View style={styles.toggleSection}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'current' && styles.toggleButtonActive]}
            onPress={() => setViewMode('current')}
          >
            <Text style={[styles.toggleText, viewMode === 'current' && styles.toggleTextActive]}>
              {t('benefits.current')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'future' && styles.toggleButtonActive]}
            onPress={() => setViewMode('future')}
          >
            <Text style={[styles.toggleText, viewMode === 'future' && styles.toggleTextActive]}>
              {t('benefits.future')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expiration Notice */}
        <View style={[styles.expirationNotice, { backgroundColor: expirationStyle.backgroundColor }]}>
          <AlertCircle size={18} color={expirationStyle.iconColor} />
          <Text style={[styles.expirationText, { color: expirationStyle.textColor }]}>
            {viewMode === 'current' 
              ? `Benefits expire in ${daysUntilExpiration} days on ${expirationDateString}`
              : `Next benefits available on ${nextMonthStartString}`}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
      {(Object.keys(mockBenefits) as CategoryKey[]).map((category) => {
        const categoryData = mockBenefits[category];
        const items = categoryData.items;
        const IconComponent = categoryData.icon;
        const totalItems = items.length;
        
        // For current view, show actual used items. For future view, all items are unused
        const usedItems = viewMode === 'current' 
          ? items.filter(item => item.used > 0).length 
          : 0;
        
        const isExpanded = expandedCategory === category;

        return (
          <View key={category} style={styles.sectionNoPad}>
            <View style={[styles.categoryCard, viewMode === 'future' && styles.categoryCardFuture]}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category)}
              >
              <View style={styles.categoryLeft}>
                <View style={[
                  styles.iconContainer, 
                  { backgroundColor: categoryData.color },
                  viewMode === 'future' && styles.iconContainerFuture
                ]}>
                  <IconComponent
                    size={24}
                    stroke={viewMode === 'future' ? '#999' : '#1A1A1A'}
                    fill="#FFFFFF"
                    strokeWidth={2}
                  />
                </View>
                <View>
                  <Text style={[
                    styles.categoryTitle, 
                    { color: viewMode === 'future' ? '#999' : theme.text }
                  ]}>
                    {getCategoryTitle(category)}
                  </Text>
                  <Text style={[styles.categorySubtitle, { color: theme.textSecondary }]}>
                    {viewMode === 'current' 
                      ? `${totalItems} ${t('benefits.items')} • ${usedItems} ${t('benefits.used')}`
                      : `${totalItems} ${t('benefits.itemsAvailable')}`}
                  </Text>
                </View>
              </View>
              <View style={styles.chevronContainer}>
                {isExpanded ? (
                  <View style={[styles.chevronUp, viewMode === 'future' && styles.chevronFuture]} />
                ) : (
                  <View style={[styles.chevronDown, viewMode === 'future' && styles.chevronFuture]} />
                )}
              </View>
            </TouchableOpacity>

              {isExpanded && (
                <View style={styles.itemsContainer}>
                  {items.map((item) => {
                    // For future view, show full quantities with no usage
                    const remaining = viewMode === 'current' 
                      ? item.quantity - item.used 
                      : item.quantity;
                    const percentage = viewMode === 'current'
                      ? (item.used / item.quantity) * 100
                      : 0;
                    const ItemIcon = item.icon;

                    return (
                      <View key={item.id} style={styles.item}>
                        <View style={styles.itemTop}>
                          <View style={[
                            styles.itemIconContainer,
                            viewMode === 'future' && styles.itemIconContainerFuture
                          ]}>
                            <ItemIcon
                              size={20}
                              stroke={viewMode === 'future' ? '#AAA' : '#666'}
                              fill={viewMode === 'future' ? '#F9F9F9' : '#F5F5F5'}
                              strokeWidth={1.5}
                            />
                          </View>
                          <View style={styles.itemLeft}>
                            <Text style={[
                              styles.itemName, 
                              { color: viewMode === 'future' ? '#999' : theme.text }
                            ]}>
                              {item.name}
                            </Text>
                            <Text style={[
                              styles.itemSuggestion, 
                              { color: viewMode === 'future' ? '#AAA' : theme.textSecondary }
                            ]}>
                              {item.suggestion}
                            </Text>
                          </View>
                          <View style={styles.itemRight}>
                            <Text style={[
                              styles.itemRemaining, 
                              { color: viewMode === 'future' ? '#999' : theme.text }
                            ]}>
                              {formatValue(remaining, item.unit)}
                            </Text>
                            <Text style={[
                              styles.itemRemainingLabel, 
                              { color: viewMode === 'future' ? '#BBB' : theme.textSecondary }
                            ]}>
                              {t('benefits.remaining')}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={[styles.progressBar, { backgroundColor: '#F0F0F0' }]}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${percentage}%`,
                                backgroundColor: percentage >= 80 ? '#DC2626' : percentage >= 50 ? '#F59E0B' : '#10B981',
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        );
      })}

      <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Card Required Overlay - shown when no card number - rendered LAST so it's on top */}
      {!cardNumber && (
        <CardRequiredOverlay message="Enter your WIC card number to view your personalized benefits, remaining balances, and purchase history" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  cardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardBannerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerContent: {
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  toggleTextActive: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
  },
  sectionNoPad: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryCardFuture: {
    opacity: 0.6,
  },
  expirationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 8,
  },
  expirationText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFuture: {
    opacity: 0.5,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  categorySubtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#666',
  },
  chevronDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#666',
  },
  chevronFuture: {
    opacity: 0.5,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  item: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIconContainerFuture: {
    opacity: 0.5,
  },
  itemLeft: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemSuggestion: {
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemRemaining: {
    fontSize: 18,
    fontWeight: '700',
  },
  itemRemainingLabel: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  bottomPadding: {
    height: 20,
  },
});
