import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Mock WIC benefits data
const mockBenefits = {
  dairy: [
    { id: '1', name: 'Milk (Whole)', quantity: 4, unit: 'gallons', used: 2 },
    { id: '2', name: 'Cheese', quantity: 1, unit: 'lb', used: 0 },
    { id: '3', name: 'Yogurt', quantity: 32, unit: 'oz', used: 16 },
  ],
  grains: [
    { id: '4', name: 'Whole Wheat Bread', quantity: 2, unit: 'loaves', used: 1 },
    { id: '5', name: 'Cereal', quantity: 2, unit: 'boxes', used: 1 },
    { id: '6', name: 'Brown Rice', quantity: 1, unit: 'lb', used: 0 },
  ],
  protein: [
    { id: '7', name: 'Eggs', quantity: 1, unit: 'dozen', used: 0 },
    { id: '8', name: 'Peanut Butter', quantity: 1, unit: 'jar', used: 0 },
    { id: '9', name: 'Dried Beans', quantity: 1, unit: 'lb', used: 0 },
  ],
  vegetables: [
    { id: '10', name: 'Fresh Vegetables', quantity: 10, unit: 'dollars', used: 4 },
    { id: '11', name: 'Carrots', quantity: 1, unit: 'lb', used: 1 },
  ],
  fruits: [
    { id: '12', name: 'Fresh Fruit', quantity: 8, unit: 'dollars', used: 3 },
    { id: '13', name: 'Apples', quantity: 2, unit: 'lbs', used: 0 },
  ],
};

type CategoryKey = keyof typeof mockBenefits;

const categoryIcons: Record<CategoryKey, keyof typeof Ionicons.glyphMap> = {
  dairy: 'nutrition',
  grains: 'leaf',
  protein: 'egg',
  vegetables: 'fitness',
  fruits: 'pizza',
};

export default function BenefitsScreen() {
  const { theme } = useTheme();
  const [expandedCategory, setExpandedCategory] = useState<CategoryKey | null>('dairy');

  const toggleCategory = (category: CategoryKey) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getCategoryTitle = (category: CategoryKey) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Your Monthly Benefits
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Tap categories to view approved items
        </Text>
      </View>

      {(Object.keys(mockBenefits) as CategoryKey[]).map((category) => {
        const items = mockBenefits[category];
        const totalItems = items.length;
        const usedItems = items.filter(item => item.used > 0).length;
        const isExpanded = expandedCategory === category;

        return (
          <View key={category} style={styles.categoryContainer}>
            <TouchableOpacity
              style={[styles.categoryHeader, { backgroundColor: theme.card }]}
              onPress={() => toggleCategory(category)}
            >
              <View style={styles.categoryLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                  <Ionicons
                    name={categoryIcons[category]}
                    size={24}
                    color={theme.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.categoryTitle, { color: theme.text }]}>
                    {getCategoryTitle(category)}
                  </Text>
                  <Text style={[styles.categorySubtitle, { color: theme.textSecondary }]}>
                    {totalItems} items • {usedItems} used
                  </Text>
                </View>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={theme.textSecondary}
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={[styles.itemsContainer, { backgroundColor: theme.card }]}>
                {items.map((item) => {
                  const remaining = item.quantity - item.used;
                  const percentage = (item.used / item.quantity) * 100;

                  return (
                    <View key={item.id} style={styles.item}>
                      <View style={styles.itemHeader}>
                        <Text style={[styles.itemName, { color: theme.text }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.itemQuantity, { color: theme.primary }]}>
                          {remaining} {item.unit}
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
                      <Text style={[styles.itemUsed, { color: theme.textSecondary }]}>
                        {item.used > 0
                          ? `Used ${item.used} of ${item.quantity} ${item.unit}`
                          : 'Not yet used'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
  },
  categoryContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '400',
  },
  categorySubtitle: {
    fontSize: 13,
    fontWeight: '300',
    marginTop: 2,
  },
  itemsContainer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 18,
    paddingBottom: 10,
    marginTop: -8,
  },
  item: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '400',
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '400',
  },
  progressBar: {
    height: 5,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  itemUsed: {
    fontSize: 13,
    fontWeight: '300',
  },
  bottomPadding: {
    height: 20,
  },
});
