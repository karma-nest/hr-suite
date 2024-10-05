/**
 * @fileoverview Utility class for handling JWT operations.
 * @version 1.0.0
 * @module JwtUtil
 */
import jwt from 'jsonwebtoken';
import { config } from '../configs/config';
import { IJwtToken } from '../interfaces';

class JwtUtil {
  private static instance: JwtUtil;

  private getJwtKey = (token_type: string): string => {
    const key = config?.auth?.jwt[token_type];
    if (!key) {
      throw new Error(`JWT type ${token_type} is not found.`);
    }
    return key;
  };

  private getTokenExpiration = (token: string): number | undefined => {
    switch (token) {
      case 'access':
        return 24 * 60 * 60;
      case 'activation':
        return 10 * 60;
      case 'password':
        return 5 * 60;
      default:
        return undefined;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static getInstance(): JwtUtil {
    if (!JwtUtil.instance) {
      JwtUtil.instance = new JwtUtil();
    }
    return JwtUtil.instance;
  }

  public generateRefreshToken = async (payload: IJwtToken): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const secrete_key = this.getJwtKey(payload?.type);
      const expiresIn = this.getTokenExpiration(payload?.type);

      jwt.sign(
        payload,
        secrete_key,
        { expiresIn },
        (error: Error, token: string) => {
          if (error) {
            reject(error?.message || error);
          } else {
            resolve(token as string);
          }
        }
      );
    });
  };

  public verifyToken = async (payload: {
    token: string;
    type: string;
  }): Promise<IJwtToken> => {
    return new Promise<IJwtToken>((resolve, reject) => {
      const secrete_key = config?.auth?.jwt[payload?.type];

      jwt.verify(
        payload?.token,
        secrete_key,
        (error: Error, decoded: IJwtToken) => {
          if (error) {
            reject(error?.message || error);
          } else {
            resolve(decoded);
          }
        }
      );
    });
  };
}

export const jwtUtil = JwtUtil.getInstance();
