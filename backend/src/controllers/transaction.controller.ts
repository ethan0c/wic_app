import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserTransactions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            approvedFood: true,
          },
        },
        store: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { storeId, items } = req.body;

    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          userId,
          storeId,
          transactionType: 'purchase',
        },
      });

      // Create transaction items and update benefits
      for (const item of items) {
        const { approvedFoodId, category, quantity, unit, productName } = item;

        // Create transaction item
        await tx.transactionItem.create({
          data: {
            transactionId: transaction.id,
            approvedFoodId,
            category,
            quantity: new Prisma.Decimal(quantity),
            unit,
            productName,
          },
        });

        // Find and update the corresponding benefit
        const benefit = await tx.wicBenefit.findFirst({
          where: {
            userId,
            category,
          },
        });

        if (benefit) {
          await tx.wicBenefit.update({
            where: { id: benefit.id },
            data: {
              remainingAmount: benefit.remainingAmount.sub(new Prisma.Decimal(quantity)),
            },
          });
        }
      }

      return transaction;
    });

    res.json(result);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};
