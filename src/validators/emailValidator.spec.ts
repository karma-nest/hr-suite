/**
 * @fileoverview
 * @version
 * @module
 */
import { emailSchema } from './emailValidator';

describe('Email Validator', () => {
  it('should validate a valid email', () => {
    const email = 'john.doe@gmail.com';

    const { error } = emailSchema.validate(email);

    expect(error).toBeUndefined();
  });

  it('should validate a valid email', () => {
    const email = 'john.doe@gmail.com';

    const { error } = emailSchema.validate(email);

    expect(error).toBeUndefined();
  });

  it('should invalidate invalid email', () => {
    const email = 'john.doe@gmailcom';

    const { error } = emailSchema.validate(email);

    expect(error?.details[0]?.message).toBe(
      'Please provide a valid email address.',
    );
  });

  it('should invalidate missinf email', () => {
    const email = undefined;

    const { error } = emailSchema.validate(email);

    expect(error?.details[0]?.message).toBe('Email is required.');
  });
});
