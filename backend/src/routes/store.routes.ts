import { Router } from 'express';
import { getNearbyStores, getAllStores } from '../controllers/store.controller';

const router = Router();

// Get nearby stores
router.get('/nearby', getNearbyStores);

// Get all stores
router.get('/', getAllStores);

export default router;
