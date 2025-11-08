import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Typography from '../../components/Typography';
import SectionCard from '../../components/home/SectionCard';
import CategoriesHeader from '../../components/categories/CategoriesHeader';
import aplData from '../../data/apl.json';

export default function CategoriesScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleCategoryPress = (categoryKey: string, categoryData: any) => {
    (navigation as any).navigate('ProductGrid', { 
      categoryKey, 
      categoryName: categoryData.name,
      allowance: categoryData.monthly_allowance,
      unit: categoryData.unit
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CategoriesHeader />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <SectionCard>
            <Typography variant="heading" weight="500" style={{ fontSize: 20 }}>
              Shop by Category
            </Typography>
            <Typography variant="body" color="textSecondary" style={{ marginTop: 8 }}>
              Tap a category to see approved items
            </Typography>
          </SectionCard>
        </View>
      
        <View style={styles.sectionNoPad}>
          <SectionCard title="Food Categories">
            <View style={styles.grid}>
              {Object.entries(aplData.categories).map(([key, category]: [string, any]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={() => handleCategoryPress(key, category)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
                    <Ionicons name={category.icon as any} size={32} color={theme.primary} />
                  </View>
                  <Typography variant="label" style={{ marginTop: 12, textAlign: 'center' }}>
                    {category.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
                    {category.monthly_allowance} {category.unit}/month
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </SectionCard>
        </View>
      
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionNoPad: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  headerSection: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  content: { flex: 1 },
  grid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});