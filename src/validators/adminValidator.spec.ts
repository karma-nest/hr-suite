/**
 * @fileoverview
 * @module
 * @version
 */
import { validateAdmin } from './adminValidator';

describe('Admin Validator', () => {
  it('should pass validation for valid data', () => {
    const adminData = {
      first_name: 'John',
      last_name: 'Doe',
    };

    const { error } = validateAdmin(adminData);

    expect(error).toBeUndefined();
  });

  it('should fail validation for first_name with numbers', () => {
    const adminData = {
      first_name: 'John123',
      last_name: 'Doe',
    };

    const { error } = validateAdmin(adminData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe(
      'First name can only contain letters',
    );
  });

  it('should fail validation for last_name with symbols', () => {
    const adminData = {
      first_name: 'John',
      last_name: 'Doe@',
    };

    const { error } = validateAdmin(adminData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe(
      'Last name can only contain letters',
    );
  });

  it('should pass validation for empty optional fields', () => {
    const adminData = {};

    const { error, value } = validateAdmin(adminData);

    expect(error).toBeUndefined();
    expect(value).toEqual({});
  });

  it('should fail validation for empty first_name and last_name', () => {
    const adminData = {
      first_name: '',
      last_name: '',
    };

    const { error } = validateAdmin(adminData);

    expect(error).toBeDefined();
    expect(error?.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'First name cannot be empty' }),
        expect.objectContaining({ message: 'Last name cannot be empty' }),
      ]),
    );
  });
});
