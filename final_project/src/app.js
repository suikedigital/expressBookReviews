const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const routes = require('./routes');
const swaggerSpec = require('./config/swagger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { 
    helmetConfig, 
    corsConfig, 
    generalRateLimit, 
    securityHeaders 
} = require('./middleware/security');

const app = express();

// Security middleware - apply early
app.use(helmetConfig);
app.use(corsConfig);
app.use(securityHeaders);

// Trust proxy if behind reverse proxy (for rate limiting)
if (config.nodeEnv === 'production') {
    app.set('trust proxy', 1);
}

// Rate limiting - apply before other middleware
app.use(generalRateLimit);

// Basic middleware
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration with enhanced security
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId', // Don't use default session name
    cookie: { 
        httpOnly: true, 
        secure: config.sessionSecure, 
        maxAge: config.sessionMaxAge,
        sameSite: 'strict' // CSRF protection
    }
}));

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Check if the API is running and healthy
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-07T10:30:00.000Z"
 */
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Book Review API Documentation'
}));

// Swagger JSON endpoint
app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Routes
app.use('/', routes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
