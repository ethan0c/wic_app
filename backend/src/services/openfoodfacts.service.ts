import axios from 'axios';

const OPENFOODFACTS_API_BASE = 'https://world.openfoodfacts.org/api/v2';

export interface ProductInfo {
  name: string;
  brand: string;
  image?: string;
  upc: string;
  size_oz?: number;
  size_display?: string;
}

export interface ScanResult {
  found: boolean;
  product?: ProductInfo;
  isWicApproved: boolean;
  wicCategory?: string;
}

/**
 * Extract size in ounces from product quantity/serving size text
 */
function extractSizeInOz(sizeText: string): { oz: number; display: string } {
  if (!sizeText) return { oz: 0, display: 'Unknown' };
  
  // Try to extract size from various formats
  const ozMatch = sizeText.match(/(\d+\.?\d*)\s*(oz|ounce)/i);
  if (ozMatch) {
    const oz = Math.round(parseFloat(ozMatch[1])); // Round to whole number
    return { oz, display: `${oz} oz` };
  }
  
  const gallonMatch = sizeText.match(/(\d+\.?\d*)\s*gallon/i);
  if (gallonMatch) {
    const gallons = parseFloat(gallonMatch[1]);
    const oz = Math.round(gallons * 128); // Round to whole number
    return { oz, display: `${gallons} gallon` };
  }
  
  const lbMatch = sizeText.match(/(\d+\.?\d*)\s*(lb|pound)/i);
  if (lbMatch) {
    const lbs = parseFloat(lbMatch[1]);
    const oz = Math.round(lbs * 16); // Round to whole number
    return { oz, display: `${lbs} lb` };
  }
  
  const mlMatch = sizeText.match(/(\d+\.?\d*)\s*(ml|milliliter)/i);
  if (mlMatch) {
    const ml = parseFloat(mlMatch[1]);
    const oz = Math.round(ml * 0.033814); // Round to whole number
    return { oz, display: `${Math.round(ml)} ml` };
  }
  
  const lMatch = sizeText.match(/(\d+\.?\d*)\s*(l|liter)/i);
  if (lMatch) {
    const liters = parseFloat(lMatch[1]);
    const oz = Math.round(liters * 33.814); // Round to whole number
    return { oz, display: `${liters}L` };
  }
  
  const gMatch = sizeText.match(/(\d+\.?\d*)\s*(g|gram)/i);
  if (gMatch) {
    const grams = parseFloat(gMatch[1]);
    const oz = Math.round(grams * 0.035274); // Round to whole number
    return { oz, display: `${Math.round(grams)}g` };
  }
  
  const kgMatch = sizeText.match(/(\d+\.?\d*)\s*(kg|kilogram)/i);
  if (kgMatch) {
    const kg = parseFloat(kgMatch[1]);
    const oz = Math.round(kg * 35.274); // Round to whole number
    return { oz, display: `${kg}kg` };
  }
  
  // If no match, return original text as display
  return { oz: 0, display: sizeText };
}

/**
 * Search OpenFoodFacts by UPC/barcode and return simplified product info with size
 */
export async function searchByUPC(upc: string): Promise<ProductInfo | null> {
  try {
    const response = await axios.get(`${OPENFOODFACTS_API_BASE}/product/${upc}.json`);
    
    if (response.data && response.data.status === 1 && response.data.product) {
      const product = response.data.product;
      
      // Extract size information from quantity or serving_size
      const sizeText = product.quantity || product.serving_size || '';
      const { oz, display } = extractSizeInOz(sizeText);
      
      return {
        upc: upc,
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        image: product.image_url || undefined,
        size_oz: oz,
        size_display: display
      };
    }

    return null;
  } catch (error) {
    console.error('OpenFoodFacts API error:', error);
    return null;
  }
}

/**
 * Search OpenFoodFacts by product name with size extraction
 */
export async function searchByName(productName: string): Promise<ProductInfo | null> {
  try {
    const response = await axios.get(`${OPENFOODFACTS_API_BASE}/search`, {
      params: {
        search_terms: productName,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 1
      }
    });

    if (response.data && response.data.products && response.data.products.length > 0) {
      const product = response.data.products[0];
      
      // Extract size information
      const sizeText = product.quantity || product.serving_size || '';
      const { oz, display } = extractSizeInOz(sizeText);
      
      return {
        upc: product.code || '',
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        image: product.image_url || undefined,
        size_oz: oz,
        size_display: display
      };
    }

    return null;
  } catch (error) {
    console.error('OpenFoodFacts search error:', error);
    return null;
  }
}

/**
 * Get detailed product information by barcode
 */
export async function getProductDetails(barcode: string): Promise<ProductInfo | null> {
  return searchByUPC(barcode);
}

// Legacy exports for backward compatibility
export const searchByPLU = searchByName;