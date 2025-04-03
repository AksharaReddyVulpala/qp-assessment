import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { Item } from '../models/grocery-items.js';
import { CartItem } from '../models/cart-item.js';
import { Cart } from '../models/cart.js';
import { setupAssociations } from '../models/associations.js';
import { Order } from '../models/order.js';
import { OrderItem } from '../models/order-items.js';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  models: [User,Item,CartItem,Cart,Order,OrderItem],
  logging: false,
});

export async function initializeDatabase() {
  try {
    
    const setupSequelize = new Sequelize({
      dialect: 'mysql',
      username: 'root',
      password: 'Aksh@1234',
      logging: false,
    });
    
    await setupSequelize.query(`CREATE DATABASE IF NOT EXISTS grocery_buying;`);
    await setupSequelize.close();

   
    await sequelize.authenticate();
    setupAssociations();
    await sequelize.sync({ alter: false }); 
    console.log('Database connected and models synchronized');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}