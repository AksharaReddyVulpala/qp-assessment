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
        quantity: { [Op.gt]: 0 } // Only items with quantity > 0
      },
      attributes: ['id', 'name', 'price', 'quantity', 'category', 'description'],
      order: [['name', 'ASC']] // Sort by name
    });
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching available items' });
  }
};

  // Get user's cart
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
            attributes: ['id', 'name', 'price', 'quantity'] // Only include needed fields
          }]
        }],
        //rejectOnEmpty: true // Throw error if no cart found
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

  // Add item to cart
  export const addToCart=async(req: Request, res: Response) =>{
    const { itemId, quantity } = req.body;
    const userId = req.userId!;

    try {
      // Find or create cart
      const [cart] = await Cart.findOrCreate({
        where: { userId },
        defaults: { userId }
      });

      // Find item
      const item = await Item.findByPk(itemId);
      if (!item || item.quantity < quantity) {
        return res.status(400).json({ 
          message: 'Item not available or insufficient stock' 
        });
      }

      // Add or update cart item
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

  // Remove item from cart
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

//   // Place order from cart
//  export const placeOrder=async(req: Request, res: Response)=> {
//     const userId = req.userId!;
//     const transaction = await sequelize.transaction();

//     try {
//       // 1. Get user's cart with items
//       const cart = await Cart.findOne({
//         where: { userId },
//         include: [CartItem],
//         transaction
//       });

//       if (!cart || cart.cartItems.length === 0) {
//         await transaction.rollback();
//         return res.status(400).json({ message: 'Cart is empty' });
//       }

//       // 2. Validate items and calculate total
//       let totalAmount = 0;
//       const orderItems = [];

//       for (const cartItem of cart.cartItems) {
//         const item = await Item.findByPk(cartItem.itemId, { transaction });
        
//         if (!item || item.quantity < cartItem.quantity) {
//           await transaction.rollback();
//           return res.status(400).json({ 
//             message: `Insufficient stock for ${item?.name || 'item'}` 
//           });
//         }

//         totalAmount += item.price * cartItem.quantity;
//         orderItems.push({
//           itemId: item.id,
//           quantity: cartItem.quantity,
//           priceAtOrder: item.price
//         });

//         // Update inventory
//         item.quantity -= cartItem.quantity;
//         await item.save({ transaction });
//       }

//       // 3. Create order
//       const order = await Order.create({
//         orderId: uuidv4(),
//         userId,
//         totalAmount,
//         status: 'pending'
//       }, { transaction });

//       // 4. Add order items
//       await OrderItem.bulkCreate(
//         orderItems.map(oi => ({ ...oi, orderId: order.id })),
//         { transaction }
//       );

//       // 5. Clear cart
//       await CartItem.destroy({ 
//         where: { cartId: cart.id },
//         transaction
//       });

//       await transaction.commit();
      
//       res.status(201).json({
//         message: 'Order placed successfully',
//         orderId: order.orderId,
//         totalAmount
//       });

//     } catch (error) {
//       await transaction.rollback();
//       res.status(500).json({ message: 'Error placing order' });
//     }
//   }
