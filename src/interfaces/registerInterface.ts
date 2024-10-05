/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Interfaces for authentication and registration configurations.
 * @version 1.0.0
 * @module authTypes
 */

import { IAdmin } from '.';

interface IBaseRegister {
  email: string;
  phone: string;
}

type IAdminRegister = IAdmin & IBaseRegister;

export { IAdminRegister };
