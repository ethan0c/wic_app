import { Router } from 'express';
import { getShoppingList, addShoppingListItem, updateShoppingListItem, deleteShoppingListItem } from '../controllers/shoppingList.controller';

const router = Router();

// Get user shopping list
router.get('/:userId/shopping-list', getShoppingList);

// Add item to shopping list
router.post('/:userId/shopping-list', addShoppingListItem);

// Update shopping list item
router.patch('/shopping-list/:itemId', updateShoppingListItem);

// Delete shopping list item
router.delete('/shopping-list/:itemId', deleteShoppingListItem);

export default router;
