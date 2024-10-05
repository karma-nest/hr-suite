/**
 * @fileoverview
 * @version 1.0.0
 * @module authenticationMiddleware
 */
import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils';
import { StatusCodes } from 'http-status-codes';
import { compareStrings } from '../validators';
import validator from 'validator';

class AuthenticationMiddleware extends ResponseUtil {
  private static instance: AuthenticationMiddleware;

  private constructor(module_name: string) {
    super();
    this.module_name = module_name;
  }

  public static getInstance(): AuthenticationMiddleware {
    if (!AuthenticationMiddleware.instance) {
      AuthenticationMiddleware.instance = new AuthenticationMiddleware(
        'authenticationMiddleware'
      );
    }
    return AuthenticationMiddleware.instance;
  }

  public isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const authorizationHeader = req.headers['x-authorization'] as string;

    // Check if authorization header[X-Authorization] is missing
    if (!authorizationHeader) {
      return this.error(
        res,
        StatusCodes.UNAUTHORIZED,
        "You did not provide an API key. You need to provide your API key in the X-Authorization header (e.g 'X-Authorization: Bearer YOUR_API_KEY')"
      );
    }

    const authorizationName = authorizationHeader.split(' ')[0];
    const authorizationToken = authorizationHeader.split(' ')[1];

    // Check if authorization name is nt  `Bearer` and authorizationToken is not valida jwt token
    if (
      !compareStrings(authorizationName, 'Bearer') ||
      !validator.isJWT(authorizationToken)
    ) {
      return this.error(
        res,
        StatusCodes.UNAUTHORIZED,
        'Invalid authorization header format.'
      );
    }

    // TODO: decode jwt without verifying it
    req.app.locals.authorizationToken = authorizationToken;

    next();
  };
}

export const authenticationMiddleware = AuthenticationMiddleware.getInstance();
