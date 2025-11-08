import { Router } from 'express';
import { getUserTransactions, createTransaction } from '../controllers/transaction.controller';

const router = Router();

// Get user transactions by WIC card number
router.get('/:wicCardNumber/transactions', getUserTransactions);

// Create new transaction
router.post('/:wicCardNumber/transactions', createTransaction);

export default router;
