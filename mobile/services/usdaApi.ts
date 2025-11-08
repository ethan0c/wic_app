/**
 * USDA FoodData Central API Integration
 * For looking up unknown products by UPC barcode
 */

const USDA_API_KEY = 'DEMO_KEY'; // TODO: Get real API key from https://fdc.nal.usda.gov/api-key-signup.html
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface USDAProduct {
  fdcId: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  gtinUpc?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  packageWeight?: string;
  ingredients?: string;
  foodCategory?: string;
  dataType: string;
}

export interface USDASearchResult {
  totalHits: number;
  foods: USDAProduct[];
}

/**
 * Search USDA FoodData Central by UPC barcode
 */
export const lookupByUPC = async (upc: string): Promise<USDAProduct | null> => {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?query=${upc}&dataType=Branded&pageSize=1&api_key=${USDA_API_KEY}`
    );
    
    if (!response.ok) {
      console.error('USDA API error:', response.status);
      return null;
    }

    const data: USDASearchResult = await response.json();
    
    if (data.totalHits === 0 || !data.foods || data.foods.length === 0) {
      return null;
    }

    return data.foods[0];
  } catch (error) {
    console.error('Error fetching from USDA:', error);
    return null;
  }
};

/**
 * Extract product size in ounces from USDA data
 */
export const extractSizeInOunces = (product: USDAProduct): number | null => {
  // Try packageWeight first (e.g., "64 oz", "1 gallon")
  if (product.packageWeight) {
    const weight = product.packageWeight.toLowerCase();
    
    // Match oz/ounce patterns
    const ozMatch = weight.match(/(\d+\.?\d*)\s*(oz|ounce)/i);
    if (ozMatch) {
      return parseFloat(ozMatch[1]);
    }
    
    // Match gallon patterns (1 gallon = 128 oz)
    const gallonMatch = weight.match(/(\d+\.?\d*)\s*gallon/i);
    if (gallonMatch) {
      return parseFloat(gallonMatch[1]) * 128;
    }
    
    // Match lb/pound patterns (1 lb = 16 oz)
    const lbMatch = weight.match(/(\d+\.?\d*)\s*(lb|pound)/i);
    if (lbMatch) {
      return parseFloat(lbMatch[1]) * 16;
    }
  }
  
  // Try servingSize as fallback
  if (product.servingSize && product.servingSizeUnit) {
    const unit = product.servingSizeUnit.toLowerCase();
    if (unit.includes('oz') || unit.includes('ounce')) {
      return product.servingSize;
    }
  }
  
  return null;
};

/**
 * Categorize USDA product into WIC categories
 */
export const categorizeProduct = (product: USDAProduct): string => {
  const description = product.description?.toLowerCase() || '';
  const category = product.foodCategory?.toLowerCase() || '';
  const brandName = product.brandName?.toLowerCase() || '';
  
  // Milk category
  if (
    description.includes('milk') ||
    category.includes('milk') ||
    category.includes('dairy')
  ) {
    return 'milk';
  }
  
  // Bread category
  if (
    description.includes('bread') ||
    description.includes('wheat bread') ||
    description.includes('white bread') ||
    category.includes('bread')
  ) {
    return 'bread';
  }
  
  // Cereal category
  if (
    description.includes('cereal') ||
    description.includes('cheerios') ||
    description.includes('oatmeal') ||
    category.includes('cereal')
  ) {
    return 'cereal';
  }
  
  // Cheese category
  if (description.includes('cheese') || category.includes('cheese')) {
    return 'cheese';
  }
  
  // Eggs category
  if (description.includes('eggs') || category.includes('eggs')) {
    return 'eggs';
  }
  
  // Juice category
  if (description.includes('juice') || category.includes('juice')) {
    return 'juice';
  }
  
  // Produce/Fruits/Vegetables
  if (
    category.includes('fruit') ||
    category.includes('vegetable') ||
    category.includes('produce')
  ) {
    return 'produce';
  }
  
  // Peanut butter
  if (description.includes('peanut butter')) {
    return 'peanut_butter';
  }
  
  // Beans
  if (description.includes('beans') || category.includes('beans')) {
    return 'beans';
  }
  
  return 'unknown';
};

/**
 * Check if product name/brand indicates it's likely WIC-eligible
 */
export const checkBrandEligibility = (product: USDAProduct): boolean => {
  const brand = product.brandOwner?.toLowerCase() || product.brandName?.toLowerCase() || '';
  
  // Common WIC-approved brands (this is a simplified check)
  const approvedBrands = [
    'great value',
    'walmart',
    'wonder',
    'general mills',
    'kroger',
    'safeway',
    'target',
    'private label',
  ];
  
  return approvedBrands.some(b => brand.includes(b));
};
