/**
 * @fileoverview
 * @module
 * @version
 */
import Joi from 'joi';

export const authSchemas = {
  register: Joi.object({
    first_name: Joi.string().required().messages({
      'string.base': 'First name must be a string.',
      'any.required': 'First name is required.',
    }),
    last_name: Joi.string().required().messages({
      'string.base': 'Last name must be a string.',
      'any.required': 'Last name is required.',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),
    phone: Joi.string().required().messages({
      'any.required': 'Phone number is required.',
    }),
  }),
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),
    password: Joi.string().min(8).required().messages({
      'any.required': 'Password is required.',
    }),
  }),
  setResetPassword: Joi.object({
    new_password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long.',
      'any.required': 'New password is required.',
    }),
    confirm_password: Joi.string()
      .valid(Joi.ref('new_password'))
      .required()
      .messages({
        'any.only': 'Confirm password must match the new password.',
        'any.required': 'Confirm password is required.',
      }),
  }),
  forgotPasswordRequestActivation: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
};
