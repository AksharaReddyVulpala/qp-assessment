import { Table, Model, Column, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './user.js';
import { CartItem } from './cart-item.js';

@Table
export class Cart extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number;
  
  @HasMany(() => CartItem)
  cartItems!: CartItem[];

}