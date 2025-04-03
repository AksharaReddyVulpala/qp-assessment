import { Request, Response } from 'express';
import { sequelize } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../models/cart.js';
import { CartItem } from '../models/cart-item.js';
import { Item } from '../models/grocery-items.js';
import { Order } from '../models/order.js';
import { OrderItem } from '../models/order-items.js';

export const placeOrder = async (req: Request, res: Response) => {
  const userId = req.userId!;
  console.log("userId from checkout",userId)
  const transaction = await sequelize.transaction();

  try {
    
    const cart = await Cart.findOne({
      where: { userId },
      include: [{
        model: CartItem,
        as: 'cartItems'
      }],
      transaction
    });

    console.log("cart",cart)

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

  
    let totalAmount = 0;
    const orderItems: Array<{
      itemId: number;
      quantity: number;
      priceAtOrder: number;
    }> = [];

    for (const cartItem of cart.cartItems) {
        console.log("cartItem---",cartItem)
      const item = await Item.findByPk(cartItem.itemId, { transaction });
      
      if (!item || item.quantity < cartItem.quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for ${item?.name || 'item'}` 
        });
      }

      totalAmount += item.price * cartItem.quantity;
      orderItems.push({
        itemId: item.id,
        quantity: cartItem.quantity,
        priceAtOrder: item.price
      });

      
      item.quantity -= cartItem.quantity;
      await item.save({ transaction });
    }

   
    const order = await Order.create({
      orderId: uuidv4(),
      userId,
      totalAmount,
      status: 'pending'
    }, { transaction });

    
    await OrderItem.bulkCreate(
      orderItems.map(oi => ({ ...oi, orderId: order.orderId })),
      { transaction }
    );

   
    await CartItem.destroy({ 
      where: { cartId: cart.id },
      transaction
    });

    await transaction.commit();
    
    return res.status(201).json({
      message: 'Order placed successfully',
      orderId: order.orderId,
      totalAmount
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Order placement error:', error);
    return res.status(500).json({ message: 'Error placing order' });
  }
};