/**
 * @fileoverview
 * @module
 * @version
 */
import Joi from 'joi';

// TODO: add tld validation `tlds: { deny: ['proton.me', 'protonmail.com', 'tutanota.io'] }`
export const emailSchema = Joi.string().email().required().messages({
  'string.email': 'Please provide a valid email address.',
  'any.required': 'Email is required.',
  'any.empty': 'Email is required.',
});
