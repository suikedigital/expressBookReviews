const config = require('../config');
const { sendError } = require('../utils/responseHelpers');

/**
 * Centralized error handling middleware
 * This should be the last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
    // Log error in development mode
    if (config.nodeEnv === 'development') {
        console.error('Error:', err);
    }
    
    // Default error
    let error = {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error'
    };
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
        error.statusCode = 400;
        error.message = 'Validation Error';
    } else if (err.name === 'JsonWebTokenError') {
        error.statusCode = 401;
        error.message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        error.statusCode = 401;
        error.message = 'Token expired';
    } else if (err.name === 'CastError') {
        error.statusCode = 400;
        error.message = 'Invalid ID format';
    }
    
    // Send error response
    return sendError(res, error.message, error.statusCode, 
        config.nodeEnv === 'development' ? err : null);
};

/**
 * Handle 404 errors for undefined routes
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

/**
 * Async error handler wrapper
 * Use this to wrap async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};
