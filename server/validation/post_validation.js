import { body } from 'express-validator'
export const postCreateValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('body').optional().isString().withMessage('Body must be a string'),
  body('postedBy').optional().isString().withMessage('Posted by must be a string')
]
