import { PrismaClient } from '@prisma/client';
import { searchByUPC, searchByName, type ScanResult, type ProductInfo } from './openfoodfacts.service';

const prisma = new PrismaClient();

/**
 * Scan a product by UPC barcode using OpenFoodFacts (no database dependency)
 */
export async function scanProduct(upc: string): Promise<ScanResult> {
  try {
    // Try to get product info from OpenFoodFacts
    const productInfo = await searchByUPC(upc);

    if (productInfo) {
      return {
        found: true,
        product: productInfo,
        isWicApproved: false, // Default to false, can be enhanced later
        wicCategory: 'unknown'
      };
    }

    return {
      found: false,
      isWicApproved: false,
    };
  } catch (error) {
    console.error('Scan error:', error);
    // Return not found instead of throwing
    return {
      found: false,
      isWicApproved: false,
    };
  }
}

/**
 * Scan produce by PLU code using OpenFoodFacts search (simplified)
 */
export async function scanProduce(plu: string): Promise<ScanResult> {
  try {
    // Search OpenFoodFacts by product name/PLU
    const productInfo = await searchByName(`PLU ${plu}`);

    if (productInfo) {
      return {
        found: true,
        product: productInfo,
        isWicApproved: false, // Default to false
        wicCategory: 'produce'
      };
    }

    return {
      found: false,
      isWicApproved: false,
    };
  } catch (error) {
    console.error('Scan error:', error);
    return {
      found: false,
      isWicApproved: false,
    };
  }
}

/**
 * Get all WIC-approved products by category (placeholder)
 */
export async function getApprovedProductsByCategory(category: string) {
  // Return empty array for now since we're not using database
  return [];
}

/**
 * Search for WIC-approved products by name (placeholder)
 */
export async function searchApprovedProducts(searchTerm: string) {
  // Return empty array for now since we're not using database
  return [];
}
