import { Router } from 'express';
import { getUserTransactions, createTransaction } from '../controllers/transaction.controller';

const router = Router();

// Get user transactions
router.get('/:userId/transactions', getUserTransactions);

// Create new transaction
router.post('/:userId/transactions', createTransaction);

export default router;
