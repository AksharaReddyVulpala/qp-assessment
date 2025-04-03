import { Request, Response } from 'express';
import { Item } from '../models/grocery-items.js';
import { User } from '../models/user.js';

// Middleware to verify admin role
export const verifyAdmin = async (req: Request, res: Response, next: Function) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 1. View all items
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
};

// 2. Add new item
export const addItem = async (req: Request, res: Response) => {
  try {
    console.log("req.body",req.body)
    console.log("Item",Item);
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.log("error",error)
    res.status(400).json({ message: 'Error creating item' });
  }
};

// 3. Remove item
export const removeItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Item.destroy({ where: { id } });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};

// 4. Update item details
export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Item.update(req.body, { where: { id } });
    if (updated) {
      const updatedItem = await Item.findByPk(id);
      return res.json(updatedItem);
    }
    return res.status(404).json({ message: 'Item not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item' });
  }
};

// 5. Manage inventory
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, quantity } = req.body;
    
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (action === 'add') {
      item.quantity += quantity;
    } else if (action === 'subtract') {
      if (item.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      item.quantity -= quantity;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory' });
  }
};