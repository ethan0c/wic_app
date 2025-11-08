import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getShoppingList = async (req: Request, res: Response) => {
  try {
    const { wicCardNumber } = req.params;

    const items = await prisma.shoppingListItem.findMany({
      where: { wicCardNumber },
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res.status(500).json({ error: 'Failed to fetch shopping list' });
  }
};

export const addShoppingListItem = async (req: Request, res: Response) => {
  try {
    const { wicCardNumber } = req.params;
    const { itemName, category } = req.body;

    const item = await prisma.shoppingListItem.create({
      data: {
        wicCardNumber,
        itemName,
        category,
      },
    });

    res.json(item);
  } catch (error) {
    console.error('Error adding shopping list item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

export const updateShoppingListItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { isChecked } = req.body;

    const item = await prisma.shoppingListItem.update({
      where: { id: itemId },
      data: {
        isChecked,
      },
    });

    res.json(item);
  } catch (error) {
    console.error('Error updating shopping list item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

export const deleteShoppingListItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    await prisma.shoppingListItem.delete({
      where: { id: itemId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting shopping list item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
