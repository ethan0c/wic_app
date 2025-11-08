import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, Circle, ShoppingBag } from 'lucide-react-native';

interface CategoryPurchase {
  id: string;
  name: string;
  icon: string;
  color: string;
  checked: boolean;
}

export default function PurchaseConfirmationScreen() {
  const navigation = useNavigation();
  
  const [categories, setCategories] = useState<CategoryPurchase[]>([
    { id: 'milk', name: 'Milk & Dairy', icon: '🥛', color: '#3B82F6', checked: false },
    { id: 'produce', name: 'Fruits & Vegetables', icon: '🥬', color: '#10B981', checked: false },
    { id: 'grains', name: 'Whole Grains', icon: '🌾', color: '#F59E0B', checked: false },
    { id: 'cereal', name: 'Cereal', icon: '🥣', color: '#8B5CF6', checked: false },
  ]);

  const toggleCategory = (id: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, checked: !cat.checked } : cat
      )
    );
  };

  const handleConfirm = () => {
    const selectedCategories = categories.filter(cat => cat.checked);
    
    if (selectedCategories.length === 0) {
      Alert.alert(
        'No Items Selected',
        'Please select at least one category you purchased from.',
        [{ text: 'OK' }]
      );
      return;
    }

    // In a real app, this would update the WIC balance
    Alert.alert(
      'Purchase Recorded',
      `Updated your balances for ${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'}.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  const selectedCount = categories.filter(cat => cat.checked).length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <ShoppingBag size={32} color="#10B981" strokeWidth={2} />
          </View>
          <Text style={styles.title}>What did you buy?</Text>
          <Text style={styles.subtitle}>
            Check the categories you purchased from to update your balances
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                category.checked && styles.categoryCardChecked,
              ]}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryLeft}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  category.checked && styles.categoryNameChecked,
                ]}>
                  {category.name}
                </Text>
              </View>
              <View style={styles.categoryRight}>
                {category.checked ? (
                  <CheckCircle2 size={28} color={category.color} fill={category.color} strokeWidth={2} />
                ) : (
                  <Circle size={28} color="#D1D5DB" strokeWidth={2} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            💡 This helps keep your benefit balances accurate. You can always check your exact balance on your EBT card.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.confirmButton,
            selectedCount === 0 && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          activeOpacity={0.7}
          disabled={selectedCount === 0}
        >
          <Text style={styles.confirmButtonText}>
            Confirm {selectedCount > 0 ? `(${selectedCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  categoryCardChecked: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
  },
  categoryNameChecked: {
    color: '#047857',
  },
  categoryRight: {
    marginLeft: 12,
  },
  helperContainer: {
    marginTop: 24,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  helperText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  skipButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  skipButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmButton: {
    flex: 2,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
