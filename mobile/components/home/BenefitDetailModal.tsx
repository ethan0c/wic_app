import React from 'react';
import { View, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import Typography from '../Typography';
import * as LucideIcons from 'lucide-react-native';

interface BenefitItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  used: number;
  total: number;
  suggestion?: string;
  icon: keyof typeof LucideIcons;
}

interface SmartPickItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface BenefitDetailModalProps {
  visible: boolean;
  onClose: () => void;
  categoryName: string;
  categoryIcon: keyof typeof LucideIcons;
  categoryColor: string;
  items: BenefitItem[];
  smartPicks?: SmartPickItem[];
}

export default function BenefitDetailModal({
  visible,
  onClose,
  categoryName,
  categoryIcon,
  categoryColor,
  items,
  smartPicks = [],
}: BenefitDetailModalProps) {
  const CategoryIcon = LucideIcons[categoryIcon] as React.ComponentType<any>;

  const formatValue = (value: number, unit: string) => {
    if (unit === 'dollars') {
      return `$${value.toFixed(2)}`;
    }
    return `${value} ${unit}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={[styles.modalHeader, { backgroundColor: categoryColor }]}>
            <View style={styles.headerLeft}>
              <CategoryIcon size={28} stroke="#1A1A1A" fill="#FFFFFF" strokeWidth={2} />
              <Typography variant="title" weight="700" style={styles.modalTitle}>
                {categoryName}
              </Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} stroke="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Items List */}
          <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
            {/* Smart Picks Section */}
            {smartPicks.length > 0 && (
              <View style={styles.smartPicksSection}>
                <Typography variant="body" weight="700" style={styles.sectionTitle}>
                  Smart Picks for You
                </Typography>
                {smartPicks.map((pick) => (
                  <View key={pick.id} style={styles.smartPickCard}>
                    <View style={styles.smartPickContent}>
                      <View style={styles.checkIconContainer}>
                        <Typography style={styles.checkIcon}>✓</Typography>
                      </View>
                      <View style={styles.smartPickInfo}>
                        <Typography variant="body" weight="600" style={styles.smartPickTitle}>
                          {pick.title}
                        </Typography>
                        {pick.subtitle && (
                          <Typography variant="caption" style={styles.smartPickSubtitle}>
                            {pick.subtitle}
                          </Typography>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Current Benefits */}
            <Typography variant="body" weight="700" style={styles.sectionTitle}>
              Your Benefits
            </Typography>
            {items.map((item) => {
              const ItemIcon = LucideIcons[item.icon] as React.ComponentType<any>;
              const remaining = item.total - item.used;
              const percentage = (remaining / item.total) * 100;

              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemIconContainer}>
                      <ItemIcon size={20} stroke="#1A1A1A" strokeWidth={2} />
                    </View>
                    <View style={styles.itemInfo}>
                      <Typography variant="body" weight="600" style={styles.itemName}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" style={styles.itemQuantity}>
                        {item.quantity} {item.unit}
                      </Typography>
                    </View>
                    <View style={styles.itemStatus}>
                      <Typography variant="body" weight="700" style={styles.remainingText}>
                        {formatValue(remaining, item.unit === 'each' ? '' : item.unit)}
                      </Typography>
                      <Typography variant="caption" style={styles.totalText}>
                        of {formatValue(item.total, item.unit === 'each' ? '' : item.unit)}
                      </Typography>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: '#1A1A1A',
                        },
                      ]}
                    />
                  </View>

                  {/* Suggestion */}
                  {item.suggestion && (
                    <View style={styles.suggestionContainer}>
                      <Typography variant="caption" style={styles.suggestionText}>
                        💡 {item.suggestion}
                      </Typography>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  itemsList: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
  },
  itemStatus: {
    alignItems: 'flex-end',
  },
  remainingText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  totalText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  suggestionContainer: {
    backgroundColor: '#FFF9E6',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  suggestionText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  smartPicksSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  smartPickCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  smartPickContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIcon: {
    fontSize: 18,
    color: '#22C55E',
    fontWeight: '700',
  },
  smartPickInfo: {
    flex: 1,
  },
  smartPickTitle: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  smartPickSubtitle: {
    fontSize: 12,
    color: '#666',
  },
});
