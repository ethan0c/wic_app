import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Milk, Apple, Wheat, Zap, Carrot, CircleDot } from 'lucide-react-native';
import { useWicCard } from '../../context/WicCardContext';
import { getUserBenefits } from '../../services/wicApi';
import type { WicBenefit } from '../../services/wicApi';
import Typography from '../../components/Typography';
import CardRequiredOverlay from '../../components/CardRequiredOverlay';

export default function ShowCashierScreen() {
  const { cardNumber } = useWicCard();
  const [benefits, setBenefits] = useState<WicBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  // Fetch user's current benefits
  useEffect(() => {
    if (cardNumber) {
      fetchBenefits();
    } else {
      setLoading(false);
    }
  }, [cardNumber]);

  const fetchBenefits = async () => {
    if (!cardNumber) return;
    
    setLoading(true);
    try {
      const benefitsData = await getUserBenefits(cardNumber);
      
      // Filter to current month benefits only
      const now = new Date();
      const currentMonthPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const currentBenefits = benefitsData.filter(b => b.monthPeriod === currentMonthPeriod);
      
      setBenefits(currentBenefits);
    } catch (error) {
      console.error('Error fetching benefits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map category to icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dairy':
        return Milk;
      case 'fruits':
        return Apple;
      case 'vegetables':
        return Carrot;
      case 'grains':
        return Wheat;
      case 'protein':
        return CircleDot;
      default:
        return Zap;
    }
  };

  // Map category to color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dairy':
        return { bg: '#E3F2FD', icon: '#1976D2' };
      case 'fruits':
        return { bg: '#FFEBEE', icon: '#D32F2F' };
      case 'vegetables':
        return { bg: '#E8F5E9', icon: '#388E3C' };
      case 'grains':
        return { bg: '#FFF3E0', icon: '#F57C00' };
      case 'protein':
        return { bg: '#FCE4EC', icon: '#C2185B' };
      default:
        return { bg: '#F3F4F6', icon: '#6B7280' };
    }
  };

  // Convert benefits to display format
  const cashierData = benefits.map(benefit => {
    const colors = getCategoryColor(benefit.category);
    const remaining = Number(benefit.remainingAmount);
    const total = Number(benefit.totalAmount);
    const used = total - remaining;
    const formatAmount = (val: number) => benefit.unit === 'dollars' ? val.toFixed(2) : val.toFixed(0);
    
    // Get common terms for measurements
    const getCommonTerms = () => {
      const category = benefit.category.toLowerCase();
      if (category === 'dairy' && benefit.unit === 'oz') {
        const gallons = (remaining / 128).toFixed(1);
        const halfGallons = (remaining / 64).toFixed(1);
        return `≈ ${halfGallons} half-gallons`;
      }
      if (category === 'grains' && benefit.unit === 'oz') {
        const loaves = (remaining / 16).toFixed(1);
        return `≈ ${loaves} loaves (16 oz each)`;
      }
      if (category === 'protein' && benefit.unit === 'dozen') {
        return `${remaining} dozen eggs`;
      }
      return null;
    };
    
    return {
      key: benefit.category.toLowerCase(),
      icon: getCategoryIcon(benefit.category),
      title: benefit.category.charAt(0).toUpperCase() + benefit.category.slice(1),
      color: colors.bg,
      iconColor: colors.icon,
      remaining: formatAmount(remaining),
      used: formatAmount(used),
      total: formatAmount(total),
      unit: benefit.unit,
      commonTerms: getCommonTerms(),
      rawRemaining: remaining,
      rawTotal: total,
      rawUsed: used,
    };
  });

  return (
    <View style={styles.container}>
      {/* Simple Header */}
      <View style={styles.headerBanner}>
        <Typography variant="heading" weight="700" style={styles.bannerTitle}>
          WIC Benefits Summary
        </Typography>
        <Typography variant="body" style={styles.bannerSubtitle}>
          Show to cashier at checkout
        </Typography>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Instructions for Cashier */}
        <View style={styles.instructionBox}>
          <Typography variant="body" weight="600" style={styles.instructionTitle}>
            📋 For Cashier
          </Typography>
          <Typography variant="body" style={styles.instructionText}>
            Customer can purchase items from the categories below using their WIC eCard. Please verify amounts at checkout.
          </Typography>
        </View>

        {loading && cardNumber ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6B7280" />
          </View>
        ) : cashierData.length > 0 ? (
          <>
            {/* Category Summary Cards */}
            {cashierData.map((category) => {
              const CategoryIcon = category.icon;
              const unitDisplay = category.unit === 'dollars' ? '$' : ` ${category.unit}`;

              return (
                <TouchableOpacity
                  key={category.key}
                  style={[styles.categoryCard, { backgroundColor: category.color }]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryLeft}>
                      <View style={[styles.categoryIconContainer, { backgroundColor: 'white' }]}>
                        <CategoryIcon size={24} stroke={category.iconColor} fill="white" strokeWidth={2} />
                      </View>
                      <Typography variant="subheading" weight="700" style={styles.categoryTitle}>
                        {category.title}
                      </Typography>
                    </View>
                  </View>
                  
                  <View style={styles.amountsRow}>
                    <View style={styles.amountBox}>
                      <Typography variant="caption" style={styles.amountLabel}>
                        Available
                      </Typography>
                      <Typography variant="title" weight="700" style={styles.amountValue}>
                        {category.unit === 'dollars' ? '$' : ''}{category.remaining}{category.unit !== 'dollars' ? ` ${category.unit}` : ''}
                      </Typography>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.amountBox}>
                      <Typography variant="caption" style={styles.amountLabel}>
                        Used
                      </Typography>
                      <Typography variant="body" weight="600" style={styles.usedValue}>
                        {category.unit === 'dollars' ? '$' : ''}{category.used}{category.unit !== 'dollars' ? ` ${category.unit}` : ''}
                      </Typography>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.amountBox}>
                      <Typography variant="caption" style={styles.amountLabel}>
                        Total
                      </Typography>
                      <Typography variant="body" weight="600" style={styles.totalValue}>
                        {category.unit === 'dollars' ? '$' : ''}{category.total}{category.unit !== 'dollars' ? ` ${category.unit}` : ''}
                      </Typography>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        ) : null}

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Card Required Overlay */}
      {!cardNumber && (
        <CardRequiredOverlay message="Enter your WIC card number to view your benefits for the cashier" />
      )}

      {/* Benefit Detail Modal */}
      {selectedCategory && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="heading" weight="700" style={{ fontSize: 24, color: '#1A1A1A' }}>
                {selectedCategory.title}
              </Typography>
              <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.closeButton}>
                <Typography variant="title" weight="600" style={{ color: '#666' }}>✕</Typography>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* Available */}
              <View style={styles.detailRow}>
                <Typography variant="body" weight="600" style={styles.detailLabel}>
                  Available This Month:
                </Typography>
                <Typography variant="heading" weight="700" style={{ color: '#10B981', fontSize: 32 }}>
                  {selectedCategory.unit === 'dollars' ? '$' : ''}{selectedCategory.remaining}{selectedCategory.unit !== 'dollars' ? ` ${selectedCategory.unit}` : ''}
                </Typography>
                {selectedCategory.commonTerms && (
                  <Typography variant="body" style={{ color: '#666', marginTop: 4 }}>
                    {selectedCategory.commonTerms}
                  </Typography>
                )}
              </View>

              <View style={styles.detailDivider} />

              {/* Used */}
              <View style={styles.detailRow}>
                <Typography variant="body" weight="600" style={styles.detailLabel}>
                  Used So Far:
                </Typography>
                <Typography variant="title" weight="700" style={{ color: '#EF4444', fontSize: 24 }}>
                  {selectedCategory.unit === 'dollars' ? '$' : ''}{selectedCategory.used}{selectedCategory.unit !== 'dollars' ? ` ${selectedCategory.unit}` : ''}
                </Typography>
              </View>

              <View style={styles.detailDivider} />

              {/* Total */}
              <View style={styles.detailRow}>
                <Typography variant="body" weight="600" style={styles.detailLabel}>
                  Monthly Total:
                </Typography>
                <Typography variant="title" weight="700" style={{ color: '#1A1A1A', fontSize: 24 }}>
                  {selectedCategory.unit === 'dollars' ? '$' : ''}{selectedCategory.total}{selectedCategory.unit !== 'dollars' ? ` ${selectedCategory.unit}` : ''}
                </Typography>
              </View>

              {/* Measurement Guide */}
              <View style={styles.measurementGuide}>
                <Typography variant="body" weight="600" style={{ color: '#F59E0B', marginBottom: 8 }}>
                  ⚠️ Important Measurement Notes:
                </Typography>
                <Typography variant="body" style={{ color: '#666', lineHeight: 20 }}>
                  • Always check product sizes carefully{'\n'}
                  • Common sizes: Milk (½ gallon = 64 oz), Bread (16 oz loaf){'\n'}
                  • Estimates shown are approximate - verify package labels{'\n'}
                  • Some products may have size restrictions
                </Typography>
              </View>
            </View>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedCategory(null)}>
              <Typography variant="body" weight="600" style={{ color: '#FFFFFF' }}>
                Close
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerBanner: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  bannerTitle: {
    fontSize: 28,
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  instructionBox: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  instructionTitle: {
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 6,
  },
  instructionText: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  categoryHeader: {
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 17,
    color: '#1A1A1A',
  },
  amountsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  amountBox: {
    flex: 1,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 20,
    color: '#10B981',
  },
  usedValue: {
    fontSize: 16,
    color: '#EF4444',
  },
  totalValue: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  measurementGuide: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  modalCloseButton: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
});
