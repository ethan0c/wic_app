import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { wicCardNumber } = req.params;
    const { firstName } = req.body;

    // Update firstName on all benefits for this card number
    await prisma.wicBenefit.updateMany({
      where: { wicCardNumber },
      data: { firstName },
    });

    res.json({ success: true, firstName });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
