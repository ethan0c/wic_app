import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import Typography from '../../components/Typography';
import { getImageSource } from '../../utils/imageHelper';
import aplData from '../../data/apl.json';

// Local product type based on apl.json structure
interface LocalProduct {
  upc: string;
  name: string;
  brand: string;
  category: string;
  size_oz: number;
  size_display: string;
  isApproved: boolean;
  imageFilename?: string;
  reasons: string[];
}

const { width, height } = Dimensions.get('window');

export default function CategoriesScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null);

  const categories = [
    { key: 'all', label: 'All Foods', emoji: '🛒' },
    { key: 'milk', label: 'Milk', emoji: '🥛' },
    { key: 'cereal', label: 'Cereal', emoji: '🥣' },
    { key: 'bread', label: 'Bread', emoji: '🍞' },
    { key: 'cheese', label: 'Cheese', emoji: '🧀' },
    { key: 'eggs', label: 'Eggs', emoji: '🥚' },
    { key: 'cvb', label: 'Fruits & Vegetables', emoji: '🥕' },
  ];

  useEffect(() => {
    loadApprovedProducts();
  }, []);

  const loadApprovedProducts = async () => {
    setLoading(true);
    try {
      // Load products from local apl.json data
      const approvedProducts = aplData.products.filter((product: any) => product.isApproved);
      console.log('📱 CategoriesScreen: Loaded products count:', approvedProducts.length);
      console.log('📱 CategoriesScreen: First product:', approvedProducts[0]);
      console.log('📱 CategoriesScreen: Products with images:', 
        approvedProducts.filter((p: any) => p.imageFilename).length
      );
      setProducts(approvedProducts);
    } catch (error) {
      console.error('Failed to load approved products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: LocalProduct) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Typography variant="body" color="textSecondary" style={{ marginTop: -40 , textAlign: 'center' }}>
            Browse all WIC-approved products
            Tap each image to expand it
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
              {filteredProducts.map((product, index) => (
                <TouchableOpacity 
                  key={product.upc || `product-${index}`} 
                  style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  activeOpacity={0.8}
                  onPress={() => handleProductPress(product)}
                >
                  <View style={styles.productImage}>
                    {(() => {
                      const imageSource = getImageSource(product.imageFilename);
                      
                      if (imageSource.source) {
                        return <Image source={imageSource.source} style={styles.image} />; 
                      }
                      
                      return (
                        <View style={[styles.imagePlaceholder, { backgroundColor: '#F3F4F6' }]}>
                          <Text style={styles.placeholderEmoji}>📦</Text>
                        </View>
                      );
                    })()}
                  </View>
                  <View style={styles.productInfo}>
                    <Typography variant="body" weight="600" numberOfLines={2}>
                      {product.name || 'Unknown Product'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
                      {product.brand || 'Generic'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {product.size_display || 'Various sizes'}
                    </Typography>
                    <View style={styles.approvedBadge}>
                      <Text style={styles.checkmark}>✓</Text>
                      <Typography variant="caption" weight="600" style={{ color: '#10B981', marginLeft: 4 }}>
                        WIC Approved
                      </Typography>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Product Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={closeModal}
          />
          <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
            {selectedProduct && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Typography variant="subheading" weight="700" style={styles.modalTitle}>
                    {selectedProduct.name}
                  </Typography>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={closeModal}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Product Image */}
                <View style={styles.modalImageContainer}>
                  {(() => {
                    const imageSource = getImageSource(selectedProduct.imageFilename);
                    
                    if (imageSource.source) {
                      return (
                        <Image 
                          source={imageSource.source} 
                          style={styles.modalImage} 
                          resizeMode="contain"
                        />
                      );
                    }
                    
                    return (
                      <View style={styles.modalImagePlaceholder}>
                        <Text style={styles.modalPlaceholderEmoji}>📦</Text>
                        <Typography variant="body" color="textSecondary" style={{ marginTop: 12 }}>
                          No Image Available
                        </Typography>
                      </View>
                    );
                  })()}
                </View>

                {/* Product Details */}
                <ScrollView style={styles.modalContent}>
                  <View style={styles.modalDetailSection}>
                    <View style={styles.modalBrandRow}>
                      <Typography variant="body" weight="600" style={styles.modalBrand}>
                        {selectedProduct.brand}
                      </Typography>
                      <View style={styles.modalApprovedBadge}>
                        <Text style={styles.modalCheckmark}>✓</Text>
                        <Typography variant="caption" weight="600" style={styles.modalApprovedText}>
                          WIC APPROVED
                        </Typography>
                      </View>
                    </View>

                    <Typography variant="caption" color="textSecondary" style={styles.modalSize}>
                      Size: {selectedProduct.size_display}
                    </Typography>
                    
                    <Typography variant="caption" color="textSecondary" style={styles.modalUpc}>
                      UPC: {selectedProduct.upc}
                    </Typography>

                    <View style={styles.modalCategoryRow}>
                      <Typography variant="caption" color="textSecondary">
                        Category: 
                      </Typography>
                      <View style={styles.modalCategoryBadge}>
                        <Text style={styles.modalCategoryEmoji}>
                          {categories.find(c => c.key === selectedProduct.category)?.emoji || '🏷️'}
                        </Text>
                        <Typography variant="caption" weight="600" style={styles.modalCategoryText}>
                          {categories.find(c => c.key === selectedProduct.category)?.label || selectedProduct.category}
                        </Typography>
                      </View>
                    </View>
                  </View>

                  {/* Additional Info */}
                  <View style={styles.modalInfoSection}>
                    <Typography variant="subheading" weight="600" style={styles.modalInfoTitle}>
                      📋 Product Information
                    </Typography>
                    <View style={styles.modalInfoGrid}>
                      <View style={styles.modalInfoItem}>
                        <Typography variant="caption" color="textSecondary">Weight</Typography>
                        <Typography variant="body" weight="600">{selectedProduct.size_oz} oz</Typography>
                      </View>
                      <View style={styles.modalInfoItem}>
                        <Typography variant="caption" color="textSecondary">Status</Typography>
                        <Typography variant="body" weight="600" style={{ color: '#10B981' }}>Approved</Typography>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    paddingBottom: 0,
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: width * 0.95,
    maxHeight: height * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    flex: 1,
    color: '#1F2937',
    fontSize: 22,
    marginRight: 16,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    height: 300,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  modalImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  modalPlaceholderEmoji: {
    fontSize: 48,
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  modalDetailSection: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 20,
  },
  modalBrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalBrand: {
    color: '#374151',
    fontSize: 20,
  },
  modalApprovedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  modalCheckmark: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: 'bold',
    marginRight: 4,
  },
  modalApprovedText: {
    color: '#10B981',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  modalSize: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  modalUpc: {
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 16,
  },
  modalCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  modalCategoryEmoji: {
    fontSize: 14,
  },
  modalCategoryText: {
    color: '#3B82F6',
    fontSize: 12,
  },
  modalInfoSection: {
    paddingBottom: 24,
  },
  modalInfoTitle: {
    color: '#374151',
    marginBottom: 16,
    fontSize: 16,
  },
  modalInfoGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  modalInfoItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
