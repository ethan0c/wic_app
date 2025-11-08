import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Plus, Check, Trash2, ShoppingBag, ChevronDown } from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';
import Typography from '../../components/Typography';
import Button from '../../components/Button';

interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}

// Predefined WIC-approved items
const SUGGESTED_ITEMS = [
  'Whole milk (½ gallon)',
  'Low-fat milk (½ gallon)',
  'Whole wheat bread 16oz',
  'Brown rice 1lb',
  'Cheerios 18oz',
  'Whole grain cereal',
  'Eggs (1 dozen)',
  'Peanut butter 18oz',
  'Fresh strawberries',
  'Fresh apples',
  'Baby carrots 1lb',
  'Fresh bananas',
  'Low-fat yogurt 32oz',
  'Cheese 1lb block',
  '100% orange juice 64oz',
  'Canned beans 15oz',
];

export default function ShoppingListScreen() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Whole milk (½ gallon)', checked: false },
    { id: '2', name: 'Whole wheat bread', checked: false },
    { id: '3', name: 'Fresh strawberries', checked: true },
    { id: '4', name: 'Cheerios 18oz', checked: false },
    { id: '5', name: 'Baby carrots', checked: true },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (newItemName.trim()) {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        checked: false,
      };
      setItems([newItem, ...items]);
      setNewItemName('');
      setShowInput(false);
    }
  };

  const addSuggestedItem = (itemName: string) => {
    // Check if item already exists
    const exists = items.some(item => item.name.toLowerCase() === itemName.toLowerCase());
    if (!exists) {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: itemName,
        checked: false,
      };
      setItems([newItem, ...items]);
    }
    setShowSuggestions(false);
  };

  const clearChecked = () => {
    setItems(items.filter(item => !item.checked));
  };

  const uncheckedCount = items.filter(item => !item.checked).length;
  const checkedCount = items.filter(item => item.checked).length;

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.headerStats}>
        <View style={styles.statCard}>
          <Typography variant="title" weight="700" style={styles.statNumber}>
            {uncheckedCount}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t('shoppingList.toBuy')}
          </Typography>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
          <Typography variant="title" weight="700" style={[styles.statNumber, { color: '#10B981' }]}>
            {checkedCount}
          </Typography>
          <Typography variant="caption" style={{ color: '#10B981' }}>
            {t('shoppingList.checkedOff')}
          </Typography>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Quick Add from Suggestions */}
        {!showInput && (
          <TouchableOpacity
            style={styles.quickAddButton}
            onPress={() => setShowSuggestions(!showSuggestions)}
            activeOpacity={0.7}
          >
            <View style={styles.quickAddLeft}>
              <Plus size={24} color="#10B981" strokeWidth={2.5} />
              <Typography variant="body" weight="600" style={{ marginLeft: 12, color: '#10B981' }}>
                {t('shoppingList.quickAddWicItems')}
              </Typography>
            </View>
            <ChevronDown 
              size={20} 
              color="#10B981" 
              strokeWidth={2.5}
              style={{ transform: [{ rotate: showSuggestions ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>
        )}

        {/* Suggested Items Dropdown */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <Typography variant="caption" color="textSecondary" style={{ marginBottom: 8, paddingHorizontal: 4 }}>
              {t('shoppingList.tapToAdd')}
            </Typography>
            <View style={styles.suggestionsGrid}>
              {SUGGESTED_ITEMS.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => addSuggestedItem(item)}
                  activeOpacity={0.7}
                >
                  <Plus size={16} color="#10B981" strokeWidth={2.5} />
                  <Typography variant="caption" weight="500" style={{ marginLeft: 6, color: '#1A1A1A' }}>
                    {item}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Add Item Input */}
        {showInput ? (
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('shoppingList.enterItemName')}
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
              onSubmitEditing={addItem}
            />
            <View style={styles.inputButtons}>
              <Button
                title={t('shoppingList.add')}
                onPress={addItem}
                size="small"
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title={t('common.cancel')}
                onPress={() => {
                  setShowInput(false);
                  setNewItemName('');
                }}
                variant="outline"
                size="small"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowInput(true)}
            activeOpacity={0.7}
          >
            <Plus size={24} color="#1A1A1A" strokeWidth={2} />
            <Typography variant="body" weight="600" style={{ marginLeft: 12 }}>
              {t('shoppingList.addItemToList')}
            </Typography>
          </TouchableOpacity>
        )}

        {/* Shopping List Items */}
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <ShoppingBag size={64} color="#9CA3AF" strokeWidth={1.5} />
            <Typography variant="subheading" color="textSecondary" style={{ marginTop: 16 }}>
              {t('shoppingList.emptyTitle')}
            </Typography>
            <Typography variant="body" color="textSecondary" style={{ marginTop: 8, textAlign: 'center' }}>
              {t('shoppingList.emptyMessage')}
            </Typography>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.listItem,
                  item.checked && styles.listItemChecked,
                ]}
              >
                <TouchableOpacity
                  style={styles.itemLeft}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    item.checked && styles.checkboxChecked,
                  ]}>
                    {item.checked && (
                      <Check size={18} color="white" strokeWidth={3} />
                    )}
                  </View>
                  <Typography
                    variant="body"
                    weight="500"
                    style={[
                      styles.itemName,
                      item.checked && styles.itemNameChecked,
                    ]}
                  >
                    {item.name}
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteItem(item.id)}
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                >
                  <Trash2 size={20} color="#EF4444" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* Clear Checked Button */}
        {checkedCount > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearChecked}
            activeOpacity={0.7}
          >
            <Typography variant="body" weight="600" style={{ color: '#EF4444' }}>
              {checkedCount === 1 
                ? `${t('shoppingList.clearChecked')}` 
                : `${t('shoppingList.clearCheckedPlural').replace('Checked Items', `${checkedCount} Checked Items`).replace('Pwodwi Make Yo', `${checkedCount} Pwodwi Make`)}`}
            </Typography>
          </TouchableOpacity>
        )}

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
  headerStats: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  addItemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  input: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputButtons: {
    flexDirection: 'row',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listItemChecked: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  itemName: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 8,
  },
  clearButton: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  quickAddLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
});
