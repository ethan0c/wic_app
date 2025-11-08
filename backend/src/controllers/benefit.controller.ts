import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const validateWicCard = async (req: Request, res: Response) => {
  try {
    const { wicCardNumber } = req.params;

    // Check if any benefits exist for this card number
    const benefit = await prisma.wicBenefit.findFirst({
      where: { wicCardNumber },
    });

    if (benefit) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    console.error('Error validating WIC card:', error);
    res.status(500).json({ error: 'Failed to validate WIC card' });
  }
};

export const getUserBenefits = async (req: Request, res: Response) => {
  try {
    const { wicCardNumber } = req.params;

    const benefits = await prisma.wicBenefit.findMany({
      where: { wicCardNumber },
      orderBy: { category: 'asc' },
    });

    res.json(benefits);
  } catch (error) {
    console.error('Error fetching benefits:', error);
    res.status(500).json({ error: 'Failed to fetch benefits' });
  }
};

export const updateBenefit = async (req: Request, res: Response) => {
  try {
    const { benefitId } = req.params;
    const { remainingAmount } = req.body;

    const benefit = await prisma.wicBenefit.update({
      where: { id: benefitId },
      data: { remainingAmount },
    });

    res.json(benefit);
  } catch (error) {
    console.error('Error updating benefit:', error);
    res.status(500).json({ error: 'Failed to update benefit' });
  }
};
