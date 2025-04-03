import { Table, Model, Column, DataType ,HasMany} from 'sequelize-typescript';
import { CartItem } from './cart-item.js';
@Table({
  tableName: 'items',
  timestamps: true,
})
export class Item extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  quantity!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  category!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  // @HasMany(() => CartItem)
  // cartItems!: CartItem[];
}