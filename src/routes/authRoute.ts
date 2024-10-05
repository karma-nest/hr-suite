/**
 * @fileoverview Routes for handling auth-related operations.
 * @version 1.0.0
 * @module authRoutes
 */

import { Router } from 'express';
import { AuthenticationController } from '../controllers';
import {
  authorizationMiddleware,
  requestLimiterMiddleware,
} from '../middlewares';

export default class AuthenticationRoutes {
  private readonly authRouter: Router;
  private readonly authController: AuthenticationController;

  constructor() {
    this.authRouter = Router();
    this.authController = new AuthenticationController();
  }

  public init = (): Router => {
    this.authRouter.post(
      '/register',
      requestLimiterMiddleware.register(),
      this.authController.register
    );

    this.authRouter.post(
      '/set-password',
      requestLimiterMiddleware.setupPassword(),
      authorizationMiddleware.authorizeSetupPassword,
      this.authController.setUpPassword
    );

    this.authRouter.post(
      '/login',
      requestLimiterMiddleware.loginAndLogout(),
      this.authController.login
    );

    this.authRouter.get(
      '/logout',
      requestLimiterMiddleware.loginAndLogout(),
      authorizationMiddleware.authorizeLogout,
      this.authController.logout
    );

    this.authRouter.get(
      '/forgot-password',
      requestLimiterMiddleware.passwordResetAndActivation(),
      this.authController.forgotPassword
    );

    this.authRouter.patch(
      '/reset-password',
      requestLimiterMiddleware.passwordResetAndActivation(),
      authorizationMiddleware.authorizePasswordReset,
      this.authController.resetPassword
    );

    this.authRouter.get(
      '/request-activation',
      requestLimiterMiddleware.passwordResetAndActivation(),
      this.authController.requestAccountActivation
    );

    this.authRouter.get(
      '/activate',
      requestLimiterMiddleware.passwordResetAndActivation(),
      authorizationMiddleware.authorizeAccountActivation,
      this.authController.confirmAccountActivation
    );

    return this.authRouter;
  };
}
