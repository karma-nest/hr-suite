/**
 * @fileoverview Helper class for managing Admin operations
 * @version 1.0.0
 * @module adminHelper
 */
import { Op } from 'sequelize';
import { IAdmin } from '../interfaces';
import { IAdminDTO, toIAdminDTO } from '../dtos';
import { Admin } from '../models/adminModel';
import { User } from '../models/userModel';

export default class AdminHelper {
  constructor(private readonly adminModel: typeof Admin = Admin) {}

  public createAdmin = async (adminData: IAdmin): Promise<void | null> => {
    try {
      await this.adminModel.create(adminData);
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  };

  public getAdmin = async (user_id: number): Promise<IAdminDTO | null> => {
    try {
      const admin = await Admin.findOne({
        where: {
          user_id: {
            [Op.eq]: user_id,
          },
        },
        include: [{ model: User, as: 'user' }],
      });

      return toIAdminDTO(admin);
    } catch (error) {
      console.error('Error retrieving admin:', error);
      throw error;
    }
  };

  public getAdmins = async (): Promise<IAdminDTO[] | null> => {
    try {
      const admins = await this.adminModel.findAll({
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      });

      const adminsDtos = admins.map((admin) => toIAdminDTO(admin));
      return adminsDtos;
    } catch (error) {
      console.error('Error retrieving admins:', error);
      throw error;
    }
  };

  public updateAdmin = async (
    user_id: number,
    adminData: Partial<IAdmin>
  ): Promise<void | null> => {
    try {
      await this.adminModel.update(adminData, {
        where: {
          id: {
            [Op.eq]: user_id,
          },
        },
      });
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  };

  public removeAdmin = async (user_id: number | string): Promise<void> => {
    try {
      await this.adminModel.destroy({
        where: {
          user_id: {
            [Op.eq]: user_id,
          },
        },
      });
    } catch (error) {
      console.error('Error removing admin:', error);
      throw error;
    }
  };
}
