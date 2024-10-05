/* eslint-disable @typescript-eslint/no-explicit-any */
import { Association, DataTypes, Model } from 'sequelize';
import { sequelize } from '../libs';
import { IAdmin } from '../interfaces';
import { User } from './userModel';

/**
 * Admin model class.
 * @class Admin
 * @extends {Model<IAdmin>}
 */
class Admin extends Model<IAdmin> implements IAdmin {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public user_id!: number;

  public static associations: {
    user: Association<Admin, User>;
  };

  public static associate(models: any) {
    Admin.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  }
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admins',
    timestamps: true,
  }
);

export { Admin };
