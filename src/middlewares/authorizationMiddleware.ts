/**
 * @fileoverview
 * @version 1.0.0
 * @module AuthorizationMiddleware
 */
import { Request, Response, NextFunction } from 'express';
import { jwtUtil, ResponseUtil } from '../utils';
import { authenticationMiddleware } from './authenticationMiddleware';
import { StatusCodes } from 'http-status-codes';

class AuthorizationMiddleware extends ResponseUtil {
  private static instance: AuthorizationMiddleware;

  private constructor(module_name: string) {
    super();
    this.module_name = module_name;
  }

  public static getInstance(): AuthorizationMiddleware {
    if (!AuthorizationMiddleware.instance) {
      AuthorizationMiddleware.instance = new AuthorizationMiddleware(
        'AuthorizationMiddleware'
      );
    }
    return AuthorizationMiddleware.instance;
  }

  public authorizeLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    authenticationMiddleware.isAuthenticated(req, res, async () => {
      try {
        const authorizationToken = req.app.locals.authorizationToken;

        const decodedAuthorization = await jwtUtil.verifyToken({
          token: authorizationToken,
          type: 'access',
        });

        req.app.locals.user = decodedAuthorization;
        next();
      } catch (error) {
        return this.error(
          res,
          StatusCodes.UNAUTHORIZED,
          'Sorry, failed to logout.'
        );
      }
    });
  };

  public authorizeAccountActivation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const redirectURI = (error_message: string) =>
      `${
        process.env.CLIENT_URI
      }/account/activate?error_message=${encodeURIComponent(error_message)}`;

    try {
      const { activation_token }: { activation_token: string } = req.body;

      if (!activation_token) {
        const error_message = 'Activation token is missing.';
        res.redirect(301, redirectURI(error_message));
      }

      const decodedactivation_token = await jwtUtil.verifyToken({
        token: activation_token,
        type: 'activation',
      });

      if (Object.keys(decodedactivation_token).length === 0) {
        const error_message = 'Unable to process your request.';
        res.redirect(301, redirectURI(error_message));
      } else {
        req.app.locals.user = decodedactivation_token;
        next();
      }
    } catch (error) {
      const error_message =
        'Invalid or expired activation token. Please request new one.';
      return res.redirect(301, redirectURI(error_message));
    }
  };

  public authorizeSetupPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const redirectURI = (error_message: string) =>
      `${
        process.env.CLIENT_URI
      }/account/set-password?error_message=${encodeURIComponent(
        error_message
      )}`;

    try {
      const { password_token }: { password_token: string } = req.body;

      console.info(password_token);

      if (!password_token) {
        const error_message = 'Password token is missing.';
        res.redirect(301, redirectURI(error_message));
      }

      console.debug('verify token');
      const decoded_password_token = await jwtUtil.verifyToken({
        token: password_token,
        type: 'password',
      });

      console.info(decoded_password_token);

      if (Object.keys(decoded_password_token).length === 0) {
        const error_message = 'Unable to process your request.';
        res.redirect(301, redirectURI(error_message));
      } else {
        req.app.locals.user = decoded_password_token;
        next();
      }
    } catch (error) {
      const error_message =
        'Invalid or expired password token. Please request new one.';
      return res.redirect(301, redirectURI(error_message));
    }
  };

  public authorizePasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const redirectURI = (error_message: string) =>
      `${
        process.env.CLIENT_URI
      }/account/recover-password?error_message=${encodeURIComponent(
        error_message
      )}`;

    try {
      const { password_token }: { password_token: string } = req.body;

      if (!password_token) {
        const error_message = 'Password token is missing.';
        res.redirect(301, redirectURI(error_message));
      }

      const decoded_password_token = await jwtUtil.verifyToken({
        token: password_token,
        type: 'password',
      });

      if (Object.keys(decoded_password_token).length === 0) {
        const error_message = 'Unable to process your request.';
        res.redirect(301, redirectURI(error_message));
      } else {
        req.app.locals.user = decoded_password_token;
        next();
      }
    } catch (error) {
      const error_message =
        'Invalid or expired password token. Please request new one.';
      return res.redirect(301, redirectURI(error_message));
    }
  };
}

export const authorizationMiddleware = AuthorizationMiddleware.getInstance();
