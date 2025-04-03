import { Request, Response } from 'express';
import { User } from '../models/user.js';
import { Cart } from '../models/cart.js';
import { CartItem } from '../models/cart-item.js';
import { Item } from '../models/grocery-items.js';
import { Op } from 'sequelize'; 
export const getAvailableItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.findAll({
      where: { 
        isActive: true,
        quantity: { [Op.gt]: 0 }
      },
      attributes: ['id', 'name', 'price', 'quantity', 'category', 'description'],
      order: [['name', 'ASC']] 
    });
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching available items' });
  }
};

 
  export const  getCart=async(req: Request, res: Response)=> {
    try {
      const userId = req.userId!;
      console.log("userId---",userId)
      const cart = await Cart.findOne({
        where: { userId },
        include: [{
          model: CartItem,
          include: [{
            model: Item,
            attributes: ['id', 'name', 'price', 'quantity'] 
          }]
        }],
       
      });
       console.log("cart",cart)
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart' });
    }
  }

 
  export const addToCart=async(req: Request, res: Response) =>{
    const { itemId, quantity } = req.body;
    const userId = req.userId!;

    try {
      
      const [cart] = await Cart.findOrCreate({
        where: { userId },
        defaults: { userId }
      });

     
      const item = await Item.findByPk(itemId);
      if (!item || item.quantity < quantity) {
        return res.status(400).json({ 
          message: 'Item not available or insufficient stock' 
        });
      }

     
      const [cartItem] = await CartItem.findOrCreate({
        where: { cartId: cart.id, itemId },
        defaults: { quantity }
      });

      if (!cartItem.isNewRecord) {
        cartItem.quantity += quantity;
        await cartItem.save();
      }

      res.json({ message: 'Item added to cart', cartItem });
    } catch (error) {
      res.status(500).json({ message: 'Error adding to cart' });
    }
  }

 
  export const removeFromCart=async(req: Request, res: Response)=> {
    const { itemId } = req.params;
    const userId = req.userId!;

    try {
      const cart = await Cart.findOne({ where: { userId } });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      await CartItem.destroy({ 
        where: { cartId: cart.id, itemId } 
      });

      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing from cart' });
    }
  }


