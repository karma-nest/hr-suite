/**
 * @fileoverview
 * @version
 * @module
 */
import { config } from '../configs/config';
import { authenticationTemplate } from '../templates';
import { redis } from '../libs';
import { AdminHelper, UserHelper } from '../helpers';
import {
  CreateErrorUtil,
  jwtUtil,
  NotificationUtil,
  passwordUtil,
} from '../utils';
import { IAdminRegister, IUser, IJwtToken } from '../interfaces';

export default class AuthenticationService {
  private readonly module_name: string;
  private readonly adminHelper: AdminHelper;
  private readonly userHelper: UserHelper;
  private readonly errorUtil: CreateErrorUtil;
  private readonly notificationUtil: NotificationUtil;

  private readonly verifyAndRefreshToken = async (
    id: number,
    access_token: string,
    cache_key: string
  ): Promise<string> => {
    try {
      if (!access_token) {
        const refresh_token = await jwtUtil.generateRefreshToken({
          id,
          type: 'access',
        });

        redis.set(cache_key, refresh_token);

        return refresh_token;
      }

      await jwtUtil.verifyToken({
        token: access_token,
        type: 'access',
      });

      return access_token;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error === 'jwt expired') {
        const refresh_token = await jwtUtil.generateRefreshToken({
          id,
          type: 'access',
        });

        redis.set(cache_key, refresh_token);

        return refresh_token;
      }

      throw new Error(error);
    }
  };

  constructor() {
    this.module_name = 'authenticationService';
    this.adminHelper = new AdminHelper();
    this.userHelper = new UserHelper();
    this.errorUtil = new CreateErrorUtil();
    this.notificationUtil = new NotificationUtil();
  }

  public register = async (
    data: IAdminRegister
  ): Promise<{ message: string }> => {
    const { email, phone, ...admin_others } = data;

    const found_user = await this.userHelper.getUser({
      email: data?.email,
    });
    if (found_user) {
      throw this.errorUtil.createBadRequestError(
        'Sorry, account with username already exists.',
        {
          module: this.module_name,
          method: 'register',
          trace: {
            error: 'User document already exists.',
            log: email,
          },
        }
      );
    }

    const user_data: IUser = {
      email,
      phone,
      role: 'admin',
    };

    try {
      const new_user = await this.userHelper.createUser(user_data);

      await this.adminHelper.createAdmin({
        ...admin_others,
        user_id: new_user?.id,
      });

      const payload = {
        id: new_user?.id,
        type: 'password',
      };

      const password_token = await jwtUtil.generateRefreshToken(payload);
      const cache_key = `password_token:${new_user?.id}`;

      await this.notificationUtil.sendEmail(
        new_user.email,
        `Set up your ${config?.mail?.mailgen?.name} password`,
        authenticationTemplate.setUpPassword(new_user.email, password_token)
      );

      await redis.set(cache_key, password_token);

      return {
        message:
          'Registration successful! Please check your email to set up your password.',
      };
    } catch (error) {
      const error_message =
        error.syscall === 'getaddrinfo'
          ? 'We ran into an issue while sending password setup email. Please request new one.'
          : 'We ran into an issue while creating your account.';
      throw this.errorUtil.createInternalServerError(error_message, {
        module: this.module_name,
        method: 'register',
        trace: {
          error: 'Failed to create account',
          log: {
            trace: error?.message || error,
            email,
          },
        },
      });
    }
  };

  public setPassword = async (
    id: number,
    password: string
  ): Promise<{
    message: string;
  }> => {
    try {
      const found_user = await this.userHelper.getUser({ id });

      if (!found_user) {
        throw this.errorUtil.createBadRequestError(
          'Invalid or expired token.',
          {
            module: this.module_name,
            method: 'setPassword',
            trace: {
              error: 'User document not found',
              log: id,
            },
          }
        );
      }

      const hashed_password = await passwordUtil.hashPassword(password);

      // delete password token generated from register
      await redis.del(`password_token:${found_user?.id}`);

      await this.userHelper.updateUser(found_user?.id, {
        password: hashed_password,
        verified: true,
      });

      const payload: IJwtToken = {
        id: found_user?.id,
        type: 'access',
      };

      const access_token = await jwtUtil.generateRefreshToken(payload);

      const cache_key = `access_token:${found_user?.id}`;

      await redis.set(cache_key, access_token);

      return {
        message: 'Password has been set successfully!',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while setting up password. Please try again.',
        {
          module: this.module_name,
          method: 'setPassword',
          trace: {
            error: 'Failed to create user password.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  public login = async (
    email: string,
    password: string
  ): Promise<{ access_token: string }> => {
    const found_user = await this.userHelper.getUser({ email });
    if (!found_user) {
      throw this.errorUtil.createValidationError(
        'Invalid username or password.',
        {
          module: this.module_name,
          method: 'login',
          trace: {
            error: 'User document not found',
            log: email,
          },
        }
      );
    }

    if (!found_user.verified) {
      throw this.errorUtil.createBadRequestError(
        'Please verify your account to continue.',
        {
          module: this.module_name,
          method: 'login',
          trace: {
            error: 'User account not verified.',
            log: email,
          },
        }
      );
    }

    const passwords_match = await passwordUtil.comparePassword(
      password,
      found_user?.password
    );
    if (!passwords_match) {
      throw this.errorUtil.createValidationError(
        'Invalid username or password.',
        {
          module: this.module_name,
          method: 'login',
          trace: {
            error: 'User password is invalid.',
            log: email,
          },
        }
      );
    }

    try {
      const cache_key = `access_token:${found_user.id}`;
      const cached_access_token = await redis.get(cache_key);

      const access_token = await this.verifyAndRefreshToken(
        found_user?.id,
        cached_access_token,
        cache_key
      );

      return { access_token };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while logging in. Please try again.',
        {
          module: this.module_name,
          method: 'login',
          trace: {
            error: 'Failed to login user.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  public logout = async (user_id: number): Promise<void> => {
    const cache_key = `access_token:${user_id}`;
    try {
      const cached_access_token = await redis.get(cache_key);

      if (!cached_access_token) {
        throw this.errorUtil.createBadRequestError(
          'We ran into an issue while logging out. Please try again.',
          {
            module: this.module_name,
            method: 'logout',
            trace: {
              error: 'Cached access token not found.',
              log: user_id,
            },
          }
        );
      }

      await redis.del(cache_key);
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while logging out. Please try again.',
        {
          module: this.module_name,
          method: 'logout',
          trace: {
            error: 'Failed to log out user.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  public forgotPassword = async (
    email: string
  ): Promise<{ message: string }> => {
    const found_user = await this.userHelper.getUser({ email });
    if (!found_user) {
      throw this.errorUtil.createNotFoundError(
        'Account associated with email not found.',
        {
          module: this.module_name,
          method: 'forgotPassword',
          trace: {
            error: 'User document not found.',
            log: email,
          },
        }
      );
    }

    if (!found_user.verified) {
      throw this.errorUtil.createBadRequestError(
        'Please verify your account to continue.',
        {
          module: this.module_name,
          method: 'forgotPassword',
          trace: {
            error: 'User account not verified.',
            log: email,
          },
        }
      );
    }

    const payload: IJwtToken = {
      id: found_user.id,
      type: 'password',
    };

    try {
      const password_token = await jwtUtil.generateRefreshToken(payload);
      const cache_key = `password_token:${found_user.id}`;

      await this.notificationUtil.sendEmail(
        found_user?.email,
        `${config?.mail?.mailgen?.name} account password reset`,
        authenticationTemplate.forgotPassword(found_user?.email, password_token)
      );

      await redis.set(cache_key, password_token);
      return {
        message:
          'A password reset link has been sent to the email associated with your account.',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while sending the password reset link. Please try again.',
        {
          module: this.module_name,
          method: 'forgotPassword',
          trace: {
            error: 'Failed to send reset link.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  public resetPassword = async (
    user_id: number,
    new_password: string
  ): Promise<{ message: string }> => {
    const found_user = await this.userHelper.getUser({ id: user_id });
    if (!found_user) {
      throw this.errorUtil.createNotFoundError(
        'We ran into an issue while resetting password. Please try again.',
        {
          module: this.module_name,
          method: 'resetPassword',
          trace: {
            error: 'User document not found.',
            log: user_id,
          },
        }
      );
    }

    const passwords_match = await passwordUtil.comparePassword(
      new_password,
      found_user?.password
    );
    if (passwords_match) {
      throw this.errorUtil.createBadRequestError(
        'Sorry, new password cannot be the same as the old password.',
        {
          module: this.module_name,
          method: 'resetPassword',
          trace: {
            error: 'User new password same as old password.',
            log: user_id || found_user.email,
          },
        }
      );
    }

    const hashed_password = await passwordUtil.hashPassword(new_password);
    const cache_key = `password_token:${found_user.id}`;

    try {
      await this.userHelper.updateUser(found_user.id, {
        password: hashed_password,
      });

      await redis.del(cache_key);

      // FIXME: if failed to send email do not reject
      await this.notificationUtil.sendEmail(
        found_user.email,
        `${config?.mail?.mailgen?.name} account password change`,
        authenticationTemplate.passwordUpdate(found_user.email, {
          ip: '127.0.0.1',
          timestamp: Date()
            .toString()
            .replace(/\s\(.*\)$/, ''),
        })
      );

      return {
        message: 'Password reset successful. Please login to continue.',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while resetting the password. Please try again.',
        {
          module: this.module_name,
          method: 'resetPassword',
          trace: {
            error: 'Failed to update password or send confirmation email.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  public requestActivation = async (
    email: string
  ): Promise<{ message: string }> => {
    const found_user = await this.userHelper.getUser({ email });
    if (!found_user) {
      throw this.errorUtil.createNotFoundError(
        'Account associated with email not found.',
        {
          module: this.module_name,
          method: 'requestActivation',
          trace: {
            error: 'User document not found.',
            log: email,
          },
        }
      );
    }

    if (found_user.verified) {
      throw this.errorUtil.createBadRequestError(
        'Account already verified. Login to continue.',
        {
          module: this.module_name,
          method: 'requestActivation',
          trace: {
            error: 'User account verified.',
            log: email,
          },
        }
      );
    }

    const payload: IJwtToken = {
      id: found_user.id,
      type: 'activation',
    };

    try {
      const activation_token = await jwtUtil.generateRefreshToken(payload);
      const cache_key = `activation_token:${found_user.id}`;

      await redis.set(cache_key, activation_token);
      await this.notificationUtil.sendEmail(
        found_user.email,
        `Welcome Aboard! Activate Your ${config?.mail?.mailgen?.name} Account`,
        authenticationTemplate.activateAccount(
          found_user.email,
          activation_token
        )
      );

      return {
        message:
          'An activation link has been sent to the email associated with your account.',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while sending the account activation link. Please try again.',
        {
          module: this.module_name,
          method: 'requestActivation',
          trace: {
            error: 'Failed to send activation email.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  public confirmActivation = async (
    user_id: number
  ): Promise<{ message: string }> => {
    const found_user = await this.userHelper.getUser({ id: user_id });
    if (!found_user) {
      throw this.errorUtil.createBadRequestError(
        'Account verification failed. Please try again.',
        {
          module: this.module_name,
          method: 'confirmActivation',
          trace: {
            error: 'User document not found.',
            log: user_id,
          },
        }
      );
    }

    const cache_key = `activation_token:${found_user.id}`;

    try {
      await this.userHelper.updateUser(user_id, { verified: true });
      await redis.del(cache_key);
      return {
        message: 'Account successfully verified. You can now login.',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'Account verification failed. Please try again.',
        {
          module: this.module_name,
          method: 'confirmActivation',
          trace: {
            error: 'Failed to activate account.',
            log: error?.message || error,
          },
        }
      );
    }
  };
}
