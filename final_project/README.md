# Book Review API

A comprehensive RESTful API for managing book reviews, built with Node.js, Express.js, and modern web security practices.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Security](#security)
- [Testing](#testing)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)

## 🚀 Project Overview

The Book Review API is a robust backend service that allows users to:

- Browse and search books by title, author, or ISBN
- Register and authenticate user accounts
- Create, read, update, and delete book reviews
- Rate books and view aggregated ratings
- Secure API endpoints with JWT authentication

### Key Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting
- **Jest** - Testing framework
- **ESLint** - Code quality

## 🏗️ Architecture

```
📁 src/
├── 📁 config/           # Configuration management
│   └── 📄 index.js     # Environment-based configuration
├── 📁 controllers/     # Request handlers and business logic
│   ├── 📄 authController.js    # Authentication operations
│   └── 📄 booksController.js   # Book-related operations
├── 📁 middleware/      # Custom middleware
│   ├── 📄 auth.js      # Authentication middleware
│   ├── 📄 errorHandler.js      # Centralized error handling
│   ├── 📄 security.js  # Security middleware
│   └── 📄 validation.js        # Input validation
├── 📁 models/          # Data models and database operations
│   ├── 📄 Book.js      # Book model with static methods
│   └── 📄 User.js      # User model with static methods
├── 📁 routes/          # Route definitions
│   ├── 📄 authRoutes.js        # Authentication routes
│   ├── 📄 booksRoutes.js       # Book routes
│   └── 📄 index.js     # Main route aggregator
├── 📁 utils/           # Utility functions
│   └── 📄 responseHelpers.js  # Standardized API responses
└── 📄 app.js          # Express app configuration
```

### Architecture Principles

- **Modular Design**: Clear separation of concerns
- **Security First**: Multiple layers of security middleware
- **Error Handling**: Centralized error management
- **Validation**: Input validation at multiple levels
- **Testing**: Comprehensive test coverage
- **Documentation**: Extensive inline documentation

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expressBookReviews/final_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Test the API**
   ```bash
   curl http://localhost:5000/health
   ```

## ⚙️ Environment Setup

### Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0

### Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=1h

# Session Configuration
SESSION_SECRET=your_session_secret_here
SESSION_MAX_AGE=3600000
SESSION_SECURE=false

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Production Setup

```bash
# Set environment to production
export NODE_ENV=production

# Start the server
npm run start:prod
```

## 📖 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication Endpoints

**Register a new user**
```http
POST /customer/register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Login**
```http
POST /customer/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Logout**
```http
POST /customer/logout
Authorization: Bearer <jwt-token>
```

#### Book Endpoints

**Get all books**
```http
GET /
```

**Get book by ISBN**
```http
GET /isbn/{isbn}
```

**Get books by author**
```http
GET /author/{author}
```

**Get books by title**
```http
GET /title/{title}
```

**Get book reviews**
```http
GET /review/{isbn}
```

#### Review Endpoints (Authenticated)

**Add or update a review**
```http
PUT /auth/review/{isbn}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "review": "This book is amazing!",
  "rating": 5
}
```

**Delete a review**
```http
DELETE /auth/review/{isbn}
Authorization: Bearer <jwt-token>
```

### Response Format

All API responses follow this standardized format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    // Error details (development mode only)
  }
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## ✨ Features

- **🔐 Secure Authentication**: JWT-based with bcrypt password hashing
- **🛡️ Security Middleware**: Helmet, CORS, rate limiting, input validation
- **📊 Comprehensive Testing**: Unit, integration, and regression tests
- **📈 Performance Monitoring**: Request timing and error tracking
- **🔄 Error Handling**: Centralized error management with proper logging
- **📝 Input Validation**: Comprehensive validation for all endpoints
- **🚀 Production Ready**: Environment-based configuration and security

## 🔒 Security

### Security Features

- **Helmet.js**: Sets various HTTP headers to secure Express apps
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Validates and sanitizes all inputs
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Session Security**: Secure session configuration
- **Content Security Policy**: Prevents XSS attacks

### Rate Limiting

- **General**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Registration**: 3 requests per 15 minutes
- **Book Operations**: 50 requests per 15 minutes

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:regression
```

### Test Coverage

The project maintains high test coverage across:

- **Unit Tests**: Controllers, models, utilities
- **Integration Tests**: API endpoints and middleware
- **Regression Tests**: Previously fixed bugs

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## ❓ FAQ

### General Questions

**Q: What Node.js version is required?**
A: Node.js 14.0.0 or higher is required for optimal compatibility.

**Q: Can I use this API with a frontend framework?**
A: Yes! This API is designed to work with any frontend framework (React, Vue, Angular, etc.)

**Q: How do I reset my JWT secret?**
A: Update the `JWT_SECRET` environment variable and restart the server. Note that this will invalidate all existing tokens.

### Authentication

**Q: How long do JWT tokens last?**
A: By default, tokens expire after 1 hour. This can be configured via the `JWT_EXPIRATION` environment variable.

**Q: Can I have multiple sessions?**
A: Yes, the API supports multiple concurrent sessions for the same user.

**Q: How do I handle token expiration?**
A: The API returns a 401 status when tokens expire. Implement token refresh logic in your client application.

### Development

**Q: How do I add new endpoints?**
A: 1) Add the controller function, 2) Add the route definition, 3) Add appropriate middleware, 4) Write tests.

**Q: How do I modify the book database?**
A: Books are stored in `router/booksdb.js`. Modify this file to add or update books.

**Q: Can I add new validation rules?**
A: Yes, add new validation middleware in `src/middleware/validation.js`.

### Deployment

**Q: How do I deploy to production?**
A: Set `NODE_ENV=production`, configure your environment variables, and use `npm run start:prod`.

**Q: What environment variables are required for production?**
A: All variables in `.env.example` should be set, with `NODE_ENV=production` and `SESSION_SECURE=true`.

**Q: How do I monitor the API in production?**
A: Use the `/health` endpoint for health checks and monitor logs for errors.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by the Book Review API Team**
