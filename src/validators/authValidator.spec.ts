/**
 * @fileoverview
 * @version
 * @module
 */
import { authSchemas } from './authValidator';

describe('authValidator', () => {
  describe('registerValidator', () => {
    it('should validate a valid admin register object', () => {
      const validAdminRegister = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'admin@example.com',
        phone: '1234567890',
      };

      const { error } = authSchemas.register.validate(validAdminRegister);
      expect(error).toBeUndefined();
    });

    it('should invalidate an object with missing required first name', () => {
      const invalidAdminRegister = {
        last_name: 'Doe',
        email: 'admin@example.com',
        phone: '1234567890',
      };

      const { error } = authSchemas.register.validate(invalidAdminRegister);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe('First name is required.');
    });

    it('should invalidate an object with missing required last name', () => {
      const invalidAdminRegister = {
        first_name: 'John',
        email: 'admin@example.com',
        phone: '1234567890',
      };

      const { error } = authSchemas.register.validate(invalidAdminRegister);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe('Last name is required.');
    });

    it('should invalidate an object with incorrect email format', () => {
      const invalidAdminRegister = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'invalid-email',
        phone: '1234567890',
      };

      const { error } = authSchemas.register.validate(invalidAdminRegister);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe(
        'Please provide a valid email address.',
      );
    });

    it('should validate optional fields when provided', () => {
      const validAdminRegister = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'admin@example.com',
        phone: '1234567890',
      };

      const { error } = authSchemas.register.validate(validAdminRegister);
      expect(error).toBeUndefined();
    });
  });

  describe('loginValidator', () => {
    it('should validate a valid login object', () => {
      const validAdminRegister = {
        email: 'admin@example.com',
        password: 'passworD@1234',
      };

      const { error } = authSchemas.login.validate(validAdminRegister);
      expect(error).toBeUndefined();
    });

    it('should invalidate an object with missing required email', () => {
      const invalidLogin = {
        password: 'passworD@1234',
      };

      const { error } = authSchemas.login.validate(invalidLogin);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe('Email is required.');
    });

    it('should invalidate an object with missing required password', () => {
      const invalidLogin = {
        email: 'admin@example.com',
      };

      const { error } = authSchemas.login.validate(invalidLogin);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe('Password is required.');
    });

    it('should invalidate an object with missing required password', () => {
      const invalidLogin = {
        email: 'invalid-email',
        password: 'passworD@1234',
      };

      const { error } = authSchemas.login.validate(invalidLogin);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe(
        'Please provide a valid email address.',
      );
    });
  });
});
