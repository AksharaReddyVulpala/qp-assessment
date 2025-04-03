import { Table, Model, Column, DataType, IsEmail, BeforeCreate ,HasOne} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import type { Optional } from 'sequelize';
import { Cart } from './cart.js';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @IsEmail
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isAdmin: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare updatedAt: Date;

  // @HasOne(() => Cart)
  // cart!: Cart;

  @BeforeCreate
  static async hashPassword(user: User) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

// DTO Interfaces
export interface SignupDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin?: boolean;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}