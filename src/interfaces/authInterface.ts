/**
 * @fileoverview Interfaces for authentication and registration configurations.
 * @version 1.0.0
 * @module authTypes
 */

interface IJwtConfig {
  access_token: string;
  activation_token: string;
  password_token: string;
}

interface IJwtToken {
  id: number;
  type: string;
}

interface IArgonConfig {
  pepper: string;
}

interface IRoleAuthConfig {
  jwt: IJwtConfig;
  argon: IArgonConfig;
}

interface IAuthConfig {
  admin: IRoleAuthConfig;
}

interface IAuthorizationConfig {
  token: string;
  role: string;
}

export { IAuthConfig, IRoleAuthConfig, IAuthorizationConfig, IJwtToken };
