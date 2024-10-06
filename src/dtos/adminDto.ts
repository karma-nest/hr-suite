/**
 * @fileoverview Maps IAdmin to IAdminDTO
 * @module adminMapper
 * @version 1.0.0
 */
import { IAdmin } from '../interfaces';
import { IUserDTO } from './userDto';

interface IAdminDTO {
  id: number;
  first_name: string;
  last_name: string;
  user: IUserDTO;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Maps an IAdmin object to an IAdminDTO.
 * @param {IAdmin} admin - The admin object to be mapped.
 * @returns {IAdminDTO} - The mapped admin DTO.
 */
const toIAdminDTO = (admin: IAdmin): IAdminDTO => ({
  id: admin.id,
  first_name: admin.first_name,
  last_name: admin.last_name,
  user: {
    id: admin.user.id,
    avatar_uri: admin.user.avatar_uri,
    email: admin.user.email,
    phone: admin.user.phone,
    role: admin.user.role,
    verified: admin.user.verified,
    password: '',
  },
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

export { IAdminDTO, toIAdminDTO };
