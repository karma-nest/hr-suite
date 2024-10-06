/**
 * @fileoverview Maps IUser to IUserDTO
 * @module userMapper
 * @version 1.0.0
 */

import { IUser } from '../interfaces';

interface IUserDTO {
  id: number;
  avatar_uri: string;
  email: string;
  phone: string;
  role: 'admin' | 'candidate' | 'recruiter';
  verified: boolean;
  password: string;
}

/**
 * Maps an IUser object to an IUserDTO.
 * @param {IUser} user - The user object to be mapped.
 * @returns {IUserDTO} - The mapped user DTO.
 */
const toIUserDTO = (user: IUser): IUserDTO => ({
  id: user?.id,
  avatar_uri: user?.avatar_uri,
  email: user?.email,
  phone: user?.phone,
  role: user?.role,
  verified: user?.verified,
  password: user?.password,
});

export { IUserDTO, toIUserDTO };
