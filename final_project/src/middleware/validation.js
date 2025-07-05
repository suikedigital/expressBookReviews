const { body, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/responseHelpers');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return sendValidationError(res, errorMessages.join(', '));
    }
    next();
};

/**
 * Validation rules for user registration
 */
const validateRegistration = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .isAlphanumeric()
        .withMessage('Username must contain only letters and numbers')
        .trim()
        .escape(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    handleValidationErrors
];

/**
 * Validation rules for user login
 */
const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .trim()
        .escape(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

/**
 * Validation rules for book creation/update
 */
const validateBook = [
    body('title')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters')
        .trim()
        .escape(),
    body('author')
        .isLength({ min: 1, max: 100 })
        .withMessage('Author must be between 1 and 100 characters')
        .trim()
        .escape(),
    body('isbn')
        .optional()
        .isISBN()
        .withMessage('Invalid ISBN format'),
    body('publicationDate')
        .optional()
        .isISO8601()
        .withMessage('Publication date must be a valid date')
        .toDate(),
    body('genre')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Genre must be less than 50 characters')
        .trim()
        .escape(),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters')
        .trim()
        .escape(),
    handleValidationErrors
];

/**
 * Validation rules for book reviews
 */
const validateReview = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('review')
        .isLength({ min: 1, max: 500 })
        .withMessage('Review must be between 1 and 500 characters')
        .trim()
        .escape(),
    handleValidationErrors
];

/**
 * Validation rules for ISBN parameter
 */
const validateISBN = [
    body('isbn')
        .isISBN()
        .withMessage('Invalid ISBN format'),
    handleValidationErrors
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateBook,
    validateReview,
    validateISBN,
    handleValidationErrors
};
