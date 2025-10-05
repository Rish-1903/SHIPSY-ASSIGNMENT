import { body, validationResult } from 'express-validator';

// Validation rules
export const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateTask = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('status')
    .isIn(['pending', 'in-progress', 'completed', 'on-hold'])
    .withMessage('Invalid status value'),
  
  body('priority')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority value'),
  
  body('estimatedHours')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Estimated hours must be between 0 and 1000'),
  
  body('actualHours')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Actual hours must be between 0 and 1000')
];

// Check for validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};
