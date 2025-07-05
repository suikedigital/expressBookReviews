const crypto = require('crypto');

// Generate secure random defaults if not provided
const generateSecureSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Warning if using default secrets in production
const warnIfDefaultSecret = (secretName, value, defaultValue) => {
    if (process.env.NODE_ENV === 'production' && value === defaultValue) {
        console.warn(`⚠️  WARNING: Using default ${secretName} in production! Please set environment variable.`);
    }
};

// Strong default secrets
const DEFAULT_JWT_SECRET = generateSecureSecret();
const DEFAULT_SESSION_SECRET = generateSecureSecret();

const config = {
    // Server configuration
    port: process.env.PORT || 5000,
    
    // JWT configuration with strong defaults
    jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '1h',
    
    // Session configuration with strong defaults
    sessionSecret: process.env.SESSION_SECRET || DEFAULT_SESSION_SECRET,
    sessionMaxAge: process.env.SESSION_MAX_AGE || 3600000, // 1 hour
    sessionSecure: process.env.SESSION_SECURE === 'true' || process.env.NODE_ENV === 'production',
    
    // Environment
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Database configuration (if needed in the future)
    dbUrl: process.env.DATABASE_URL || '',
    
    // API configuration
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
    
    // Security configuration
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    
    // Rate limiting configuration
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests per window
    
    // CORS configuration
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Warn about default secrets in production
if (!process.env.JWT_SECRET) {
    warnIfDefaultSecret('JWT_SECRET', config.jwtSecret, DEFAULT_JWT_SECRET);
}
if (!process.env.SESSION_SECRET) {
    warnIfDefaultSecret('SESSION_SECRET', config.sessionSecret, DEFAULT_SESSION_SECRET);
}

module.exports = config;
