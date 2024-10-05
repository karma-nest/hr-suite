/**
 * @fileoverview RequestLimiterMiddleware class implementing Singleton pattern
 * @module RequestLimiterMiddleware
 * @version 1.0.0
 */

import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

class RequestLimiterMiddleware {
  private static instance: RequestLimiterMiddleware;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): RequestLimiterMiddleware {
    if (!RequestLimiterMiddleware.instance) {
      RequestLimiterMiddleware.instance = new RequestLimiterMiddleware();
    }
    return RequestLimiterMiddleware.instance;
  }

  public register: () => RateLimitRequestHandler =
    (): RateLimitRequestHandler => {
      return rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 5,
        standardHeaders: true,
        legacyHeaders: false,
      });
    };

  public setupPassword: () => RateLimitRequestHandler =
    (): RateLimitRequestHandler => {
      return rateLimit({
        windowMs: 10 * 60 * 1000,
        limit: 1,
        standardHeaders: true,
        legacyHeaders: false,
      });
    };

  public loginAndLogout: () => RateLimitRequestHandler =
    (): RateLimitRequestHandler => {
      return rateLimit({
        windowMs: 10 * 60 * 1000,
        limit: 10,
        standardHeaders: true,
        legacyHeaders: false,
      });
    };

  public passwordResetAndActivation: () => RateLimitRequestHandler =
    (): RateLimitRequestHandler => {
      return rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 5,
        standardHeaders: true,
        legacyHeaders: false,
      });
    };
}

export const requestLimiterMiddleware = RequestLimiterMiddleware.getInstance();
