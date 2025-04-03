// src/models/order.model.ts
import { Table, Model, Column, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from './user.js';
import { v4 as uuidv4 } from 'uuid';
import { Item } from './grocery-items.js';
import { Order } from './order.js';
@Table({
  tableName: 'order_items',
  timestamps: true
})
export class OrderItem extends Model {
  @ForeignKey(() => Order)
  @Column
  declare orderId: string;

  @ForeignKey(() => Item)
  @Column
  declare itemId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare quantity: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  declare priceAtOrder: number;
}