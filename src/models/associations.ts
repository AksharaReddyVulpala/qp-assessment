import { User } from './user.js';
import { Cart } from './cart.js';
import { Item } from './grocery-items.js';
import { CartItem } from './cart-item.js';
import { Order } from './order.js';
import { OrderItem } from './order-items.js';

export function setupAssociations() {
    // User-Cart relationship (1:1)
    User.hasOne(Cart, {
      foreignKey: 'userId',
      as: 'userCart'  // Changed from 'cart' to make unique
    });
  
    Cart.belongsTo(User, {
      foreignKey: 'userId',
      as: 'cartOwner'  // Changed from 'user' to make unique
    });
  
    // Item-CartItem relationship (1:M)
    Item.hasMany(CartItem, {
      foreignKey: 'itemId',
      as: 'inCarts'  // Changed from 'cartItems'
    });
  
    CartItem.belongsTo(Item, {
      foreignKey: 'itemId',
      as: 'cartItemProduct'  // Changed from 'item'
    });
  
    // User-Order relationship (1:M)
    User.hasMany(Order, {
      foreignKey: 'userId',
      as: 'userOrders'
    });
  
    Order.belongsTo(User, {
      foreignKey: 'userId',
      as: 'orderCustomer'
    });
  
    // Order-OrderItem relationship (1:M)
    Order.hasMany(OrderItem, {
      foreignKey: 'orderId',
      as: 'orderedItems'
    });
  
    OrderItem.belongsTo(Order, {
      foreignKey: 'orderId',
      as: 'parentOrder'
    });
  
    // Item-OrderItem relationship (1:M)
    Item.hasMany(OrderItem, {
      foreignKey: 'itemId',
      as: 'itemOrders'  // Changed from 'orderItems'
    });
  
    OrderItem.belongsTo(Item, {
      foreignKey: 'itemId',
      as: 'orderedProduct'  // Changed from 'item'
    });
  }