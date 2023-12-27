import { body } from 'express-validator'

export const validateRegistration = [
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
]

export const validateLogin = [
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
]
