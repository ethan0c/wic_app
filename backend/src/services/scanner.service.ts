import { PrismaClient } from '@prisma/client';
import { searchByUPC, searchByPLU, type ScanResult } from './usda.service';

const prisma = new PrismaClient();

/**
 * Scan a product by UPC barcode
 * 1. Check our local DB for WIC approval
 * 2. Fetch product details from USDA API
 * 3. Return combined result
 */
export async function scanProduct(upc: string): Promise<ScanResult> {
  try {
    // Step 1: Check our local database for WIC approval
    const localProduct = await prisma.generalFood.findFirst({
      where: { upcCode: upc },
      include: {
        approvedFood: true,
      },
    });

    // Step 2: Fetch from USDA API for rich product details
    const usdaProduct = await searchByUPC(upc);

    // Step 3: Combine results
    if (localProduct) {
      return {
        found: true,
        usdaProduct: usdaProduct || undefined,
        isWicApproved: !!localProduct.approvedFood?.isApproved,
        wicCategory: localProduct.approvedFood?.wicCategory,
        approvalNotes: localProduct.approvedFood?.notes || undefined,
        localProduct: {
          id: localProduct.id,
          name: localProduct.name,
          brand: localProduct.brand || 'Generic',
          category: localProduct.category,
          subcategory: localProduct.subcategory || '',
        },
      };
    }

    // Product not in our DB but found in USDA
    if (usdaProduct) {
      return {
        found: true,
        usdaProduct,
        isWicApproved: false,
        localProduct: undefined,
      };
    }

    // Not found anywhere
    return {
      found: false,
      isWicApproved: false,
    };
  } catch (error) {
    console.error('Scan error:', error);
    throw error;
  }
}

/**
 * Scan produce by PLU code
 */
export async function scanProduce(plu: string): Promise<ScanResult> {
  try {
    // Check local DB
    const localProduct = await prisma.generalFood.findFirst({
      where: { pluCode: plu },
      include: {
        approvedFood: true,
      },
    });

    // Fetch from USDA
    const usdaProduct = await searchByPLU(plu);

    if (localProduct) {
      return {
        found: true,
        usdaProduct: usdaProduct || undefined,
        isWicApproved: !!localProduct.approvedFood?.isApproved,
        wicCategory: localProduct.approvedFood?.wicCategory,
        approvalNotes: localProduct.approvedFood?.notes || undefined,
        localProduct: {
          id: localProduct.id,
          name: localProduct.name,
          brand: localProduct.brand || 'Fresh',
          category: localProduct.category,
          subcategory: localProduct.subcategory || '',
        },
      };
    }

    if (usdaProduct) {
      return {
        found: true,
        usdaProduct,
        isWicApproved: false,
      };
    }

    return {
      found: false,
      isWicApproved: false,
    };
  } catch (error) {
    console.error('Scan error:', error);
    throw error;
  }
}

/**
 * Get all WIC-approved products by category
 */
export async function getApprovedProductsByCategory(category: string) {
  return prisma.approvedFood.findMany({
    where: {
      wicCategory: category,
      isApproved: true,
    },
    include: {
      generalFood: true,
    },
  });
}

/**
 * Search for WIC-approved products by name
 */
export async function searchApprovedProducts(searchTerm: string) {
  return prisma.approvedFood.findMany({
    where: {
      isApproved: true,
      generalFood: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    },
    include: {
      generalFood: true,
    },
  });
}
