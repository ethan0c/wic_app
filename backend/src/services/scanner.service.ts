import { PrismaClient } from '@prisma/client';
import { searchByUPC, searchByPLU, type ScanResult } from './usda.service';

const prisma = new PrismaClient();

/**
 * Scan a product by UPC barcode
 * 1. Check our local DB for WIC approval
 * 2. Fetch product details from USDA API
 * 3. Find approved alternatives if product is not approved
 * 4. Return combined result
 */
export async function scanProduct(upc: string): Promise<ScanResult & { alternatives?: any[] }> {
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

    // Step 3: If product is not approved, find alternatives in same category
    let alternatives: any[] = [];
    const category = localProduct?.category || localProduct?.approvedFood?.wicCategory;
    
    if (category && (!localProduct?.approvedFood?.isApproved || !localProduct)) {
      // Find approved alternatives in the same category
      const approvedAlternatives = await prisma.approvedFood.findMany({
        where: {
          wicCategory: category,
          isApproved: true,
        },
        include: {
          generalFood: true,
        },
        take: 3, // Limit to 3 alternatives
      });

      alternatives = approvedAlternatives.map(alt => ({
        id: alt.generalFood.id,
        upc: alt.generalFood.upcCode,
        name: alt.generalFood.name,
        brand: alt.generalFood.brand,
        size: alt.generalFood.unitSize,
        imageUrl: alt.generalFood.imageUrl,
        category: alt.wicCategory,
      }));
    }

    // Step 4: Combine results
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
        alternatives: alternatives.length > 0 ? alternatives : undefined,
      };
    }

    // Product not in our DB but found in USDA
    if (usdaProduct) {
      return {
        found: true,
        usdaProduct,
        isWicApproved: false,
        localProduct: undefined,
        alternatives: alternatives.length > 0 ? alternatives : undefined,
      };
    }

    // Not found anywhere
    return {
      found: false,
      isWicApproved: false,
      alternatives: [],
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
