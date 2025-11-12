import axios from 'axios';

const OPENFOODFACTS_API_BASE = 'https://world.openfoodfacts.org/api/v2';

export interface ProductInfo {
  name: string;
  brand: string;
  image?: string;
  upc: string;
}

export interface ScanResult {
  found: boolean;
  product?: ProductInfo;
  isWicApproved: boolean;
  wicCategory?: string;
}

/**
 * Search OpenFoodFacts by UPC/barcode and return simplified product info
 */
export async function searchByUPC(upc: string): Promise<ProductInfo | null> {
  try {
    const response = await axios.get(`${OPENFOODFACTS_API_BASE}/product/${upc}.json`);
    
    if (response.data && response.data.status === 1 && response.data.product) {
      const product = response.data.product;
      return {
        upc: upc,
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        image: product.image_url || undefined
      };
    }

    return null;
  } catch (error) {
    console.error('OpenFoodFacts API error:', error);
    return null;
  }
}

/**
 * Search OpenFoodFacts by product name
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
      return {
        upc: product.code || '',
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        image: product.image_url || undefined
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