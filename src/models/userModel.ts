/* eslint-disable @typescript-eslint/no-explicit-any */
import { Association, DataTypes, Model } from 'sequelize';
import { sequelize } from '../libs';
import { IUser } from '../interfaces';
import { Admin } from './adminModel';
import { UserRoleType } from '../types';

/**
 * User model class.
 * @class User
 * @extends {Model<IUser>}
 */
class User extends Model<IUser> implements IUser {
  public id!: number;
  public avatar_uri?: string;
  public email!: string;
  public phone!: string;
  public password!: string;
  public role!: UserRoleType;
  public verified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    admin: Association<User, Admin>;
  };

  public static associate(models: any) {
    User.hasOne(models.Admin, {
      foreignKey: 'user_id',
      as: 'admin',
      onDelete: 'CASCADE',
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    avatar_uri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin'),
      allowNull: false,
      defaultValue: 'admin',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  },
);

export { User };
