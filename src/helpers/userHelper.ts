/**
 * @fileoverview Helper class for managing User operations.
 * @version 1.0.0
 * @module userHelper
 */

import { Op } from 'sequelize';
import { IUserDTO, toIUserDTO } from '../dtos';
import { IUser, IUserQuery } from '../interfaces';
import { User } from '../models/userModel';

export default class UserHelper {
  constructor(private readonly userModel: typeof User = User) {}

  public createUser = async (user_data: IUser): Promise<IUserDTO | null> => {
    try {
      const user = await this.userModel.create(user_data);
      return toIUserDTO(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  public getUser = async (userQuery: IUserQuery): Promise<IUserDTO | null> => {
    try {
      const user = await this.userModel.findOne({
        where: {
          [Op.or]: [
            {
              id: {
                [Op.eq]: userQuery?.id,
              },
            },
            {
              email: {
                [Op.eq]: userQuery?.email,
              },
            },
          ],
        },
      });

      if (!user) {
        return null;
      }

      return toIUserDTO(user);
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw error;
    }
  };

  public updateUser = async (
    user_id: number,
    user_data: Partial<IUser>,
  ): Promise<void | null> => {
    try {
      const updateCondition = { ...user_data };
      await this.userModel.update(updateCondition, {
        where: {
          id: {
            [Op.eq]: user_id,
          },
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  public removeUser = async (user_id: number): Promise<void | null> => {
    try {
      await this.userModel.destroy({
        where: {
          id: {
            [Op.eq]: user_id,
          },
        },
      });
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  };
}
