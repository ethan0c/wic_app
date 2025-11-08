import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { scanProduct, scanProduce, getApprovedProductsByCategory, searchApprovedProducts } from '../services/scanner.service';

const prisma = new PrismaClient();

export const scanByUPC = async (req: Request, res: Response) => {
  try {
    const { upc } = req.params;
    const { wicCardNumber } = req.query;
    
    const result = await scanProduct(upc);
    
    // If card number provided and product is approved, calculate benefit impact
    if (wicCardNumber && typeof wicCardNumber === 'string' && result.isWicApproved && result.wicCategory) {
      const currentMonth = new Date();
      const monthPeriod = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
      
      const benefit = await prisma.wicBenefit.findFirst({
        where: {
          wicCardNumber: wicCardNumber,
          category: result.wicCategory,
          monthPeriod,
        },
      });

      if (benefit) {
        // Parse product size to calculate impact
        let productSize = 0;
        const unitSize = result.localProduct?.subcategory || '';
        const sizeStr = result.usdaProduct?.householdServingFullText || unitSize;
        
        // Try to extract size from various formats
        const ozMatch = sizeStr.match(/(\d+\.?\d*)\s*(oz|ounce)/i);
        if (ozMatch) productSize = parseFloat(ozMatch[1]);
        
        const gallonMatch = sizeStr.match(/(\d+\.?\d*)\s*gallon/i);
        if (gallonMatch) productSize = parseFloat(gallonMatch[1]) * 128;
        
        const lbMatch = sizeStr.match(/(\d+\.?\d*)\s*(lb|pound)/i);
        if (lbMatch) productSize = parseFloat(lbMatch[1]) * 16;

        const currentRemaining = parseFloat(benefit.remainingAmount.toString());
        const afterPurchase = currentRemaining - productSize;
        const canAfford = afterPurchase >= 0;
        const maxQuantity = productSize > 0 ? Math.floor(currentRemaining / productSize) : 0;

        (result as any).benefitCalculation = {
          category: benefit.category,
          currentRemaining,
          afterPurchase: Math.max(0, afterPurchase),
          unit: benefit.unit,
          canAfford,
          maxQuantity,
          productSize,
        };
      }
    }
    
    res.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to scan product' });
  }
};

export const scanByPLU = async (req: Request, res: Response) => {
  try {
    const { plu } = req.params;
    const result = await scanProduce(plu);
    res.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to scan produce' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await getApprovedProductsByCategory(category);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    const products = await searchApprovedProducts(q);
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
};
