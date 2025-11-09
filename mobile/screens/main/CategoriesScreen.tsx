import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import Typography from '../../components/Typography';
import { getAllApprovedProducts, ApprovedProduct } from '../../services/wicApi';

export default function CategoriesScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ApprovedProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Foods', emoji: '🛒' },
    { key: 'dairy', label: 'Dairy', emoji: '🥛' },
    { key: 'grains', label: 'Grains', emoji: '🌾' },
    { key: 'protein', label: 'Protein', emoji: '🐟' },
    { key: 'fruits', label: 'Fruits', emoji: '🍎' },
    { key: 'vegetables', label: 'Vegetables', emoji: '�' },
  ];

  useEffect(() => {
    loadApprovedProducts();
  }, []);

  const loadApprovedProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllApprovedProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to load approved products:', error);
      // Fallback to empty array on error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.wicCategory?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Typography variant="heading" weight="600" style={{ fontSize: 24 }}>
            WIC Approved Foods
          </Typography>
          <Typography variant="body" color="textSecondary" style={{ marginTop: 8 }}>
            Browse all WIC-approved products
          </Typography>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryChip,
                selectedCategory === cat.key && styles.categoryChipActive,
                { backgroundColor: selectedCategory === cat.key ? theme.primary : '#F3F4F6' }
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Typography 
                variant="caption" 
                weight="600"
                style={{ color: selectedCategory === cat.key ? '#FFFFFF' : '#6B7280' }}
              >
                {cat.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products List */}
        <View style={styles.productsSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Typography variant="body" color="textSecondary" style={{ marginTop: 16 }}>
                Loading approved products...
              </Typography>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Typography variant="subheading" weight="600" style={{ marginTop: 12 }}>
                No Products Found
              </Typography>
              <Typography variant="body" color="textSecondary" style={{ marginTop: 8, textAlign: 'center' }}>
                No approved products in this category yet
              </Typography>
            </View>
          ) : (
            <View style={styles.productsList}>
              {filteredProducts.map((product) => (
                <View 
                  key={product.id} 
                  style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <View style={styles.productImage}>
                    {product.generalFood?.imageFilename ? (
                      <Image source={{ uri: product.generalFood.imageFilename }} style={styles.image} /> 
                    ) : (
                      <View style={[styles.imagePlaceholder, { backgroundColor: '#F3F4F6' }]}>
                        <Text style={styles.placeholderEmoji}>📦</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Typography variant="body" weight="600" numberOfLines={2}>
                      {product.generalFood?.name || 'Unknown Product'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
                      {product.generalFood?.brand || 'Generic'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {product.generalFood?.unitSize || 'Various sizes'}
                    </Typography>
                    <View style={styles.approvedBadge}>
                      <Text style={styles.checkmark}>✓</Text>
                      <Typography variant="caption" weight="600" style={{ color: '#10B981', marginLeft: 4 }}>
                        WIC Approved
                      </Typography>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  categoriesScroll: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  productsList: {
    gap: 12,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  checkmark: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
});
