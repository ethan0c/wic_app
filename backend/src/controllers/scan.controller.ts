import { Request, Response } from 'express';
import { scanProduct, scanProduce, getApprovedProductsByCategory, searchApprovedProducts } from '../services/scanner.service';

export const scanByUPC = async (req: Request, res: Response) => {
  try {
    const { upc } = req.params;
    const result = await scanProduct(upc);
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
    const products = await getApprovedProductsByCategory('');
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
