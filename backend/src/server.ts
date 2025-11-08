import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import routes from './routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint - API info
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'WIC Benefits API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      scan: '/api/scan/upc/:upc or /api/scan/plu/:plu',
      stores: '/api/stores/nearby?latitude=X&longitude=Y&radius=10',
      benefits: '/api/users/:wicCardNumber/benefits',
      profile: '/api/users/:wicCardNumber/profile (PATCH)',
      transactions: '/api/users/:wicCardNumber/transactions',
      shoppingList: '/api/users/:wicCardNumber/shopping-list'
    },
    note: 'No user accounts - use WIC card number as identifier'
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API routes
app.use('/api', routes);

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
