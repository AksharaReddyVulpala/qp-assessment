// src/models/order.model.ts
import { Table, Model, Column, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from './user.js';
import { v4 as uuidv4 } from 'uuid';
import { Item } from './grocery-items.js';

@Table({
  tableName: 'orders',
  timestamps: true
})
export class Order extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4()
  })
  declare orderId: string;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  })
  declare status: string;
}

