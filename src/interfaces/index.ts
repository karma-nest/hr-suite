/**
 * @fileoverview
 * @module
 * @version
 */
export { IAdmin, IAdminCreation } from './adminInterface';

export {
  IAuthConfig,
  IRoleAuthConfig,
  IAuthorizationConfig,
  IJwtToken,
} from './authInterface';

export { IConfig } from './configInterface';

export { IDatabaseConfig } from './databaseInterface';

export { IErrorSource, IErrorDetails } from './errorInterface';

export { INotificationConfig, INotificationLib } from './notificationInterface';

export { IAdminRegister } from './registerInterface';

export {
  IUser,
  IUserQuery,
  IUpdateContactQuery,
  IUpdatePasswordQuery,
  IUserCreation,
} from './userInterface';
