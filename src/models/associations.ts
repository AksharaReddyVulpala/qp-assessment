import { User } from './user.js';
import { Cart } from './cart.js';
import { Item } from './grocery-items.js';
import { CartItem } from './cart-item.js';
import { Order } from './order.js';
import { OrderItem } from './order-items.js';

export function setupAssociations() {
    
    User.hasOne(Cart, {
      foreignKey: 'userId',
      as: 'userCart'  
    });
  
    Cart.belongsTo(User, {
      foreignKey: 'userId',
      as: 'cartOwner' 
    });
  
    
    Item.hasMany(CartItem, {
      foreignKey: 'itemId',
      as: 'inCarts'  
    });
  
    CartItem.belongsTo(Item, {
      foreignKey: 'itemId',
      as: 'cartItemProduct'  
    });
  
    
    User.hasMany(Order, {
      foreignKey: 'userId',
      as: 'userOrders'
    });
  
    Order.belongsTo(User, {
      foreignKey: 'userId',
      as: 'orderCustomer'
    });
  
    
    Order.hasMany(OrderItem, {
      foreignKey: 'orderId',
      as: 'orderedItems'
    });
  
    OrderItem.belongsTo(Order, {
      foreignKey: 'orderId',
      as: 'parentOrder'
    });
  
    
    Item.hasMany(OrderItem, {
      foreignKey: 'itemId',
      as: 'itemOrders'  
    });
  
    OrderItem.belongsTo(Item, {
      foreignKey: 'itemId',
      as: 'orderedProduct'  
    });
  }