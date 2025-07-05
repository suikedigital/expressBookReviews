/**
 * Response helper utilities for consistent API responses
 */

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const sendError = (res, message = 'An error occurred', statusCode = 500, error = null) => {
    const response = {
        success: false,
        message
    };
    
    if (error && process.env.NODE_ENV === 'development') {
        response.error = error;
    }
    
    return res.status(statusCode).json(response);
};

const sendValidationError = (res, message = 'Validation failed', errors = []) => {
    return res.status(400).json({
        success: false,
        message,
        errors
    });
};

const sendNotFound = (res, message = 'Resource not found') => {
    return res.status(404).json({
        success: false,
        message
    });
};

const sendUnauthorized = (res, message = 'Unauthorized') => {
    return res.status(401).json({
        success: false,
        message
    });
};

const sendForbidden = (res, message = 'Forbidden') => {
    return res.status(403).json({
        success: false,
        message
    });
};

module.exports = {
    sendSuccess,
    sendError,
    sendValidationError,
    sendNotFound,
    sendUnauthorized,
    sendForbidden
};
