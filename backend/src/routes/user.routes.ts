import { Router } from 'express';
import { getUserBenefits, updateBenefit, updateProfile, validateWicCard } from '../controllers/benefit.controller';

const router = Router();

// Validate WIC card number
router.get('/:wicCardNumber/validate', validateWicCard);

// Get user benefits by WIC card number
router.get('/:wicCardNumber/benefits', getUserBenefits);

// Update a specific benefit
router.patch('/benefits/:benefitId', updateBenefit);

// Update profile (first name)
router.patch('/:wicCardNumber/profile', updateProfile);

export default router;
