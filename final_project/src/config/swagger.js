const swaggerJSDoc = require('swagger-jsdoc');

/**
 * Swagger configuration options
 * @type {Object}
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Book Review API',
            version: '1.0.1',
            description: 'A comprehensive RESTful API for managing book reviews, built with Node.js and Express.js',
            contact: {
                name: 'API Support',
                email: 'support@bookreviewapi.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://your-production-url.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Unique username for the user',
                            example: 'johndoe'
                        },
                        password: {
                            type: 'string',
                            description: 'User password (min 6 characters)',
                            example: 'securepassword123'
                        }
                    }
                },
                Book: {
                    type: 'object',
                    properties: {
                        isbn: {
                            type: 'string',
                            description: 'ISBN of the book',
                            example: '9781234567890'
                        },
                        title: {
                            type: 'string',
                            description: 'Title of the book',
                            example: 'The Great Gatsby'
                        },
                        author: {
                            type: 'string',
                            description: 'Author of the book',
                            example: 'F. Scott Fitzgerald'
                        },
                        reviews: {
                            type: 'object',
                            description: 'Reviews for the book',
                            additionalProperties: {
                                type: 'object',
                                properties: {
                                    review: {
                                        type: 'string',
                                        description: 'Review text'
                                    },
                                    rating: {
                                        type: 'number',
                                        description: 'Rating from 1-5'
                                    }
                                }
                            }
                        }
                    }
                },
                Review: {
                    type: 'object',
                    required: ['review'],
                    properties: {
                        review: {
                            type: 'string',
                            description: 'Review text for the book',
                            example: 'This book is amazing!'
                        },
                        rating: {
                            type: 'number',
                            minimum: 1,
                            maximum: 5,
                            description: 'Rating from 1 to 5',
                            example: 5
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Operation completed successfully'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error description'
                        },
                        error: {
                            type: 'object',
                            description: 'Error details (development mode only)'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization'
            },
            {
                name: 'Books',
                description: 'Book management operations'
            },
            {
                name: 'Reviews',
                description: 'Book review operations'
            },
            {
                name: 'Health',
                description: 'System health check'
            }
        ]
    },
    apis: [
        './src/routes/*.js',
        './src/controllers/*.js'
    ]
};

/**
 * Generate Swagger specification
 * @type {Object}
 */
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
