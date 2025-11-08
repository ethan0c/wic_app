import { Router } from 'express';
import { scanByUPC, scanByPLU, getProductsByCategory, searchProducts } from '../controllers/scan.controller';

const router = Router();

// Get all approved products
router.get('/approved', getProductsByCategory);

// Scan product by UPC barcode
router.get('/upc/:upc', scanByUPC);

// Scan produce by PLU code
router.get('/plu/:plu', scanByPLU);

// Get approved products by category
router.get('/category/:category', getProductsByCategory);

// Search approved products
router.get('/search', searchProducts);

export default router;
