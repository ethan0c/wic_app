import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserBenefits = async (req: Request, res: Response) => {
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
