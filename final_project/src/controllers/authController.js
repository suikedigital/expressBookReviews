const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { sendSuccess, sendError, sendValidationError, sendUnauthorized } = require('../utils/responseHelpers');

/**
 * User registration
 */
const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        if (User.exists(username)) {
            return sendValidationError(res, 'Username already exists');
        }
        
        // Create user
        const success = await User.create(username, password);
        
        if (success) {
            return sendSuccess(res, null, 'User registered successfully!', 201);
        } else {
            return sendError(res, 'Failed to register user', 500);
        }
    } catch (error) {
        next(error);
    }
};

/**
 * User login
 */
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        // Authenticate user
        const isAuthenticated = await User.authenticate(username, password);
        
        if (!isAuthenticated) {
            return sendUnauthorized(res, 'Invalid username or password');
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { username }, 
            config.jwtSecret, 
            { expiresIn: config.jwtExpiration }
        );
        
        // Store token in session
        req.session.authorization = { accessToken: token };
        
        // Save session
        req.session.save(err => {
            if (err) {
                console.log('Session save error:', err);
            }
        });
        
        return sendSuccess(res, { token }, 'Login successful');
    } catch (error) {
        next(error);
    }
};

/**
 * User logout
 */
const logout = async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return sendError(res, 'Could not log out', 500);
            }
            return sendSuccess(res, null, 'Logout successful');
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout
};
