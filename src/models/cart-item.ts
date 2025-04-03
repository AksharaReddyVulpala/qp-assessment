import { Table, Model, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Cart } from './cart.js';
import { Item } from './grocery-items.js';




@Table
export class CartItem extends Model {
  @ForeignKey(() => Cart)
  @Column
  cartId!: number;

  @ForeignKey(() => Item)
  @Column
  itemId!: number;

  @Column
  quantity!: number;

  @BelongsTo(() => Item)
  item!: Item;
}