/**
 * @fileoverview AuthenticationController to handle authentication related operations.
 * @version 1.0.0
 * @module AuthenticationController
 */

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { AuthenticationService } from '../services';
import { ResponseUtil } from '../utils';
import { IAdminRegister } from '../interfaces';
import { authSchemas } from '../validators';

export default class AuthenticationController extends ResponseUtil {
  private readonly authenticationService: AuthenticationService;

  constructor() {
    super();
    this.module_name = 'authenticationController';
    this.authenticationService = new AuthenticationService();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user_data = req.body as IAdminRegister;

      const { error } = authSchemas.register.validate(user_data);

      if (error) {
        return this.unprocessableEntity(res, error?.details[0]?.message);
      }

      const payload = await this.authenticationService.register(user_data);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public setUpPassword = async (req: Request, res: Response): Promise<void> => {
    const { id }: { id: number } = req.app.locals.user;
    const {
      new_password,
      confirm_password,
    }: { new_password: string; confirm_password: string } = req.body;

    const { error } = authSchemas.setResetPassword.validate({
      new_password,
      confirm_password,
    });

    if (error) {
      return this.unprocessableEntity(res, error?.details[0]?.message);
    }

    try {
      const payload = await this.authenticationService.setPassword(
        id,
        confirm_password,
      );

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;

    const { error } = authSchemas.login.validate({ email, password });

    if (error) {
      return this.unprocessableEntity(res, error?.details[0]?.message);
    }

    try {
      const payload = await this.authenticationService.login(email, password);
      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    console.debug(req.app.locals.user);
    const { id }: { id: number } = req.app.locals.user;

    if (!id) {
      return this.unprocessableEntity(res, undefined);
    }

    try {
      const payload = await this.authenticationService.logout(id);
      return this.response(res, StatusCodes.NO_CONTENT, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { email }: { email: string } = req.body;

    const { error } =
      authSchemas.forgotPasswordRequestActivation.validate(email);

    if (error) {
      return this.unprocessableEntity(res, error?.details[0]?.message);
    }

    try {
      const payload = await this.authenticationService.forgotPassword(email);
      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { id }: { id: number } = req.app.locals.user;
    const {
      new_password,
      confirm_password,
    }: { new_password: string; confirm_password: string } = req.body;

    const { error } = authSchemas.setResetPassword.validate({
      new_password,
      confirm_password,
    });

    if (error) {
      return this.unprocessableEntity(res, error?.details[0]?.message);
    }

    try {
      const payload = await this.authenticationService.resetPassword(
        id,
        confirm_password,
      );

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public requestAccountActivation = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { email }: { email: string } = req.body;

    const { error } =
      authSchemas.forgotPasswordRequestActivation.validate(email);

    if (error) {
      return this.unprocessableEntity(res, error?.details[0]?.message);
    }

    try {
      const payload = await this.authenticationService.requestActivation(email);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public confirmAccountActivation = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { id }: { id: number } = req.app.locals.user;

    if (!id) {
      return this.unprocessableEntity(res, undefined);
    }

    try {
      const payload = await this.authenticationService.confirmActivation(id);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
