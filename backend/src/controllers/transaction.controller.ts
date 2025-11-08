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
          totalAmount: new Prisma.Decimal(0),
        },
      });

      let totalAmount = new Prisma.Decimal(0);

      // Create transaction items and update benefits
      for (const item of items) {
        const { approvedFoodId, quantity, amount } = item;

        // Create transaction item
        await tx.transactionItem.create({
          data: {
            transactionId: transaction.id,
            approvedFoodId,
            quantity,
            amount: new Prisma.Decimal(amount),
          },
        });

        totalAmount = totalAmount.add(new Prisma.Decimal(amount));

        // Get the approved food to find the category
        const approvedFood = await tx.approvedFood.findUnique({
          where: { id: approvedFoodId },
        });

        if (approvedFood) {
          // Find and update the corresponding benefit
          const benefit = await tx.wicBenefit.findFirst({
            where: {
              userId,
              category: approvedFood.category,
            },
          });

          if (benefit) {
            await tx.wicBenefit.update({
              where: { id: benefit.id },
              data: {
                remainingAmount: benefit.remainingAmount.sub(new Prisma.Decimal(amount)),
              },
            });
          }
        }
      }

      // Update transaction total
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { totalAmount },
      });

      return transaction;
    });

    res.json(result);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};
