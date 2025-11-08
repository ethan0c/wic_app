import { Router } from 'express';
import scanRoutes from './scan.routes';
import storeRoutes from './store.routes';
import userRoutes from './user.routes';
import transactionRoutes from './transaction.routes';
import shoppingListRoutes from './shoppingList.routes';

const router = Router();

// Mount routes
router.use('/scan', scanRoutes);
router.use('/stores', storeRoutes);
router.use('/users', userRoutes);
router.use('/users', transactionRoutes);
router.use('/users', shoppingListRoutes);

export default router;
