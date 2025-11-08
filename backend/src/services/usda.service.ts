import axios from 'axios';

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';
const USDA_API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';

export interface USDAProduct {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  gtinUpc?: string;
  ingredients?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients?: Array<{
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

export interface ScanResult {
  found: boolean;
  usdaProduct?: USDAProduct;
  isWicApproved: boolean;
  wicCategory?: string;
  approvalNotes?: string;
  localProduct?: {
    id: string;
    name: string;
    brand: string;
    category: string;
    subcategory: string;
  };
}

/**
 * Search USDA FoodData Central by UPC/barcode
 */
export async function searchByUPC(upc: string): Promise<USDAProduct | null> {
  try {
    const response = await axios.get(`${USDA_API_BASE}/foods/search`, {
      params: {
        api_key: USDA_API_KEY,
        query: upc,
        dataType: 'Branded',
        pageSize: 1,
      },
    });

    if (response.data.foods && response.data.foods.length > 0) {
      const food = response.data.foods[0];
      return {
        fdcId: food.fdcId,
        description: food.description,
        brandName: food.brandName,
        brandOwner: food.brandOwner,
        gtinUpc: food.gtinUpc,
        ingredients: food.ingredients,
        servingSize: food.servingSize,
        servingSizeUnit: food.servingSizeUnit,
        householdServingFullText: food.householdServingFullText,
        foodNutrients: food.foodNutrients?.map((n: any) => ({
          nutrientName: n.nutrientName,
          value: n.value,
          unitName: n.unitName,
        })),
      };
    }

    return null;
  } catch (error) {
    console.error('USDA API error:', error);
    return null;
  }
}

/**
 * Search USDA FoodData Central by PLU code (for produce)
 */
export async function searchByPLU(plu: string): Promise<USDAProduct | null> {
  try {
    const response = await axios.get(`${USDA_API_BASE}/foods/search`, {
      params: {
        api_key: USDA_API_KEY,
        query: plu,
        dataType: 'Foundation,SR Legacy',
        pageSize: 1,
      },
    });

    if (response.data.foods && response.data.foods.length > 0) {
      const food = response.data.foods[0];
      return {
        fdcId: food.fdcId,
        description: food.description,
        foodNutrients: food.foodNutrients?.map((n: any) => ({
          nutrientName: n.nutrientName,
          value: n.value,
          unitName: n.unitName,
        })),
      };
    }

    return null;
  } catch (error) {
    console.error('USDA API error:', error);
    return null;
  }
}

/**
 * Get detailed food information by FDC ID
 */
export async function getFoodDetails(fdcId: number): Promise<USDAProduct | null> {
  try {
    const response = await axios.get(`${USDA_API_BASE}/food/${fdcId}`, {
      params: {
        api_key: USDA_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error('USDA API error:', error);
    return null;
  }
}
