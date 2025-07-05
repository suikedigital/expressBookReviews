const jwt = require('jsonwebtoken');
const config = require('../config');
const { sendUnauthorized, sendForbidden } = require('../utils/responseHelpers');

/**
 * Authentication middleware for protected routes
 */
const authenticateToken = (req, res, next) => {
    if (!req.session || !req.session.authorization || !req.session.authorization.accessToken) {
        return sendUnauthorized(res, 'User not logged in');
    }
    
    const token = req.session.authorization.accessToken;
    
    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            return sendForbidden(res, 'User not authenticated');
        }
        
        req.user = user;
        next();
    });
};

/**
 * Optional authentication middleware - sets user if token is valid but doesn't block
 */
const optionalAuth = (req, res, next) => {
    if (req.session && req.session.authorization && req.session.authorization.accessToken) {
        const token = req.session.authorization.accessToken;
        
        jwt.verify(token, config.jwtSecret, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    optionalAuth
};
