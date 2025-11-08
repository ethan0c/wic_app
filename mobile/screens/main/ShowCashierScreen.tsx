import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Milk, Apple, Wheat, Zap, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react-native';
import Typography from '../../components/Typography';

export default function ShowCashierScreen() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('dairy');

  const cashierData = [
    {
      key: 'dairy',
      icon: Milk,
      title: 'Milk & Dairy',
      color: '#E3F2FD',
      iconColor: '#1976D2',
      items: [
        { name: 'Whole Milk', allowance: '4 half-gallons', remaining: '3 left' },
        { name: 'Low-fat Yogurt', allowance: '32 oz', remaining: '16 oz left' },
        { name: 'Cheese', allowance: '1 lb', remaining: '1 lb left' },
      ],
    },
    {
      key: 'produce',
      icon: Apple,
      title: 'Fruits & Vegetables',
      color: '#FFEBEE',
      iconColor: '#D32F2F',
      items: [
        { name: 'Fresh Fruits', allowance: '$16.00', remaining: '$7.50 left' },
        { name: 'Fresh Vegetables', allowance: '$16.00', remaining: '$10.82 left' },
      ],
    },
    {
      key: 'grains',
      icon: Wheat,
      title: 'Whole Grains',
      color: '#FFF3E0',
      iconColor: '#F57C00',
      items: [
        { name: 'Whole Wheat Bread (16 oz)', allowance: '2 loaves', remaining: '1 loaf left' },
        { name: 'Brown Rice', allowance: '1 lb', remaining: '1 lb left' },
      ],
    },
    {
      key: 'cereal',
      icon: Zap,
      title: 'Cereal',
      color: '#FCE4EC',
      iconColor: '#C2185B',
      items: [
        { name: 'Whole Grain Cereal', allowance: '72 oz/month', remaining: '45 oz left' },
      ],
    },
  ];

  const toggleCategory = (key: string) => {
    setExpandedCategory(expandedCategory === key ? null : key);
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.checkIconContainer}>
          <CheckCircle2 size={40} color="#10B981" strokeWidth={2.5} />
        </View>
        <Typography variant="title" weight="700" style={styles.bannerTitle}>
          WIC Approved Items
        </Typography>
        <Typography variant="body" style={styles.bannerSubtitle}>
          Show this screen to the cashier at checkout
        </Typography>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Instructions for Cashier */}
        <View style={styles.instructionBox}>
          <Typography variant="body" weight="600" style={styles.instructionTitle}>
            📋 For Cashier:
          </Typography>
          <Typography variant="body" style={styles.instructionText}>
            Please verify that items match the approved categories and quantities listed below. 
            Customer has WIC eCard for payment.
          </Typography>
        </View>

        {/* Category Cards */}
        {cashierData.map((category) => {
          const CategoryIcon = category.icon;
          const isExpanded = expandedCategory === category.key;

          return (
            <TouchableOpacity
              key={category.key}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => toggleCategory(category.key)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: 'white' }]}>
                    <CategoryIcon size={28} stroke={category.iconColor} fill="white" strokeWidth={2} />
                  </View>
                  <Typography variant="subheading" weight="700" style={styles.categoryTitle}>
                    {category.title}
                  </Typography>
                </View>
                {isExpanded ? (
                  <ChevronUp size={24} color="#1A1A1A" />
                ) : (
                  <ChevronDown size={24} color="#1A1A1A" />
                )}
              </View>

              {isExpanded && (
                <View style={styles.itemsList}>
                  {category.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <View style={styles.itemDot} />
                      <View style={styles.itemDetails}>
                        <Typography variant="body" weight="600" style={styles.itemName}>
                          {item.name}
                        </Typography>
                        <View style={styles.itemAllowance}>
                          <Typography variant="caption" style={styles.allowanceText}>
                            Monthly: {item.allowance}
                          </Typography>
                          <Typography variant="caption" weight="600" style={styles.remainingText}>
                            • {item.remaining}
                          </Typography>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Important Notes */}
        <View style={styles.notesCard}>
          <Typography variant="body" weight="700" style={styles.notesTitle}>
            ℹ️ Important Notes
          </Typography>
          <View style={styles.notesList}>
            <View style={styles.noteRow}>
              <Typography variant="body" style={styles.noteBullet}>•</Typography>
              <Typography variant="body" style={styles.noteText}>
                Only items from these approved categories can be purchased with WIC
              </Typography>
            </View>
            <View style={styles.noteRow}>
              <Typography variant="body" style={styles.noteBullet}>•</Typography>
              <Typography variant="body" style={styles.noteText}>
                Specific brands and sizes may have restrictions
              </Typography>
            </View>
            <View style={styles.noteRow}>
              <Typography variant="body" style={styles.noteBullet}>•</Typography>
              <Typography variant="body" style={styles.noteText}>
                Benefits reset on the 1st of each month and do not roll over
              </Typography>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
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
    paddingTop: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  checkIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 24,
    color: '#1A1A1A',
    marginBottom: 8,
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
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  instructionTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  itemsList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A1A1A',
    marginTop: 7,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemAllowance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  allowanceText: {
    fontSize: 13,
    color: '#666',
  },
  remainingText: {
    fontSize: 13,
    color: '#10B981',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notesTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  notesList: {
    gap: 8,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteBullet: {
    fontSize: 16,
    color: '#1A1A1A',
    marginRight: 8,
    fontWeight: '700',
  },
  noteText: {
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
    lineHeight: 20,
  },
});
