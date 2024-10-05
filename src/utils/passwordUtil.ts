/**
 * @fileoverview Utility class for password hashing and validation using Argon2.
 * This class follows the Singleton pattern to ensure only one instance is used.
 * @module PasswordUtil
 * @version 1.0.0
 */

import * as argon2 from 'argon2';
import { config } from '../configs/config';

class PasswordUtil {
  private static instance: PasswordUtil;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): PasswordUtil {
    if (!PasswordUtil.instance) {
      PasswordUtil.instance = new PasswordUtil();
    }
    return PasswordUtil.instance;
  }

  public async hashPassword(password: string): Promise<string> {
    try {
      const secret = Buffer.from(config?.auth?.argon);

      return await argon2.hash(password, { secret });
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message || error}`);
    }
  }

  public async comparePassword(
    plainPassword: string,
    hashed_password: string
  ): Promise<boolean> {
    try {
      const secret = Buffer.from(config?.auth?.argon);

      return await argon2.verify(hashed_password, plainPassword, { secret });
    } catch (error) {
      throw new Error(`Password validation failed: ${error.message || error}`);
    }
  }
}

export const passwordUtil = PasswordUtil.getInstance();
