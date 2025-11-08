import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { scanProduct, scanProduce, getApprovedProductsByCategory, searchApprovedProducts } from './services/scanner.service';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/scan/upc/:upc - Scan product by UPC barcode
app.get('/api/scan/upc/:upc', async (req: Request, res: Response) => {
  try {
    const { upc } = req.params;
    const result = await scanProduct(upc);
    res.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to scan product' });
  }
});

// GET /api/scan/plu/:plu - Scan produce by PLU code
app.get('/api/scan/plu/:plu', async (req: Request, res: Response) => {
  try {
    const { plu } = req.params;
    const result = await scanProduce(plu);
    res.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to scan produce' });
  }
});

// GET /api/products/approved/:category - Get WIC-approved products by category
app.get('/api/products/approved/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await getApprovedProductsByCategory(category);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/search?q=milk - Search WIC-approved products
app.get('/api/products/search', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term required' });
    }
    const products = await searchApprovedProducts(searchTerm);
    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// GET /api/stores/nearby - Get stores near location
app.get('/api/stores/nearby', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = parseFloat(req.query.radius as string) || 10; // miles

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid lat and lng required' });
    }

    // Simple distance calculation - for production use PostGIS
    const stores = await prisma.wicStore.findMany({
      where: { isActive: true },
      take: 20,
    });

    // Calculate distances
    const storesWithDistance = stores.map(store => {
      const distance = calculateDistance(
        lat,
        lng,
        parseFloat(store.latitude.toString()),
        parseFloat(store.longitude.toString())
      );
      return { ...store, distance };
    }).filter(s => s.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json(storesWithDistance);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// GET /api/users/:userId/benefits - Get user's WIC benefits
app.get('/api/users/:userId/benefits', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const benefits = await prisma.wicBenefit.findMany({
      where: { userId },
      orderBy: { category: 'asc' },
    });
    res.json(benefits);
  } catch (error) {
    console.error('Error fetching benefits:', error);
    res.status(500).json({ error: 'Failed to fetch benefits' });
  }
});

// GET /api/users/:userId/transactions - Get user's transaction history
app.get('/api/users/:userId/transactions', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        store: true,
        items: true,
      },
      orderBy: { transactionDate: 'desc' },
      take: limit,
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST /api/users/:userId/transactions - Record a transaction
app.post('/api/users/:userId/transactions', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { storeId, items } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        storeId,
        transactionType: 'purchase',
        items: {
          create: items.map((item: any) => ({
            approvedFoodId: item.approvedFoodId,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            productName: item.productName,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update user benefits
    for (const item of items) {
      await prisma.wicBenefit.updateMany({
        where: {
          userId,
          category: item.category,
        },
        data: {
          remainingAmount: {
            decrement: parseFloat(item.quantity),
          },
        },
      });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// GET /api/users/:userId/shopping-list - Get shopping list
app.get('/api/users/:userId/shopping-list', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const items = await prisma.shoppingListItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res.status(500).json({ error: 'Failed to fetch shopping list' });
  }
});

// POST /api/users/:userId/shopping-list - Add item to shopping list
app.post('/api/users/:userId/shopping-list', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { itemName, category } = req.body;

    const item = await prisma.shoppingListItem.create({
      data: {
        userId,
        itemName,
        category,
      },
    });

    res.json(item);
  } catch (error) {
    console.error('Error adding to shopping list:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// PATCH /api/shopping-list/:itemId - Update shopping list item
app.patch('/api/shopping-list/:itemId', async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { isChecked } = req.body;

    const item = await prisma.shoppingListItem.update({
      where: { id: itemId },
      data: { isChecked },
    });

    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/shopping-list/:itemId - Delete shopping list item
app.delete('/api/shopping-list/:itemId', async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    await prisma.shoppingListItem.delete({
      where: { id: itemId },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Haversine distance calculation (miles)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WIC API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});
