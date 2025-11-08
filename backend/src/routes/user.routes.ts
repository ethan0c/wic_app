import { Router } from 'express';
import { getUserBenefits, updateBenefit } from '../controllers/benefit.controller';

const router = Router();

// Get user benefits
router.get('/:userId/benefits', getUserBenefits);

// Update a specific benefit
router.patch('/benefits/:benefitId', updateBenefit);

export default router;
