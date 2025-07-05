# Project Architecture

This project has been refactored for better maintainability and follows modern Node.js/Express.js best practices.

## Directory Structure

```
src/
├── config/           # Configuration management
│   └── index.js     # Environment-based configuration
├── controllers/     # Request handlers and business logic
│   ├── authController.js    # Authentication operations
│   └── booksController.js   # Book-related operations
├── middleware/      # Custom middleware
│   ├── auth.js      # Authentication middleware
│   └── errorHandler.js      # Centralized error handling
├── models/          # Data models and database operations
│   ├── Book.js      # Book model with static methods
│   └── User.js      # User model with static methods
├── routes/          # Route definitions
│   ├── authRoutes.js        # Authentication routes
│   ├── booksRoutes.js       # Book routes
│   └── index.js     # Main route aggregator
├── utils/           # Utility functions
│   └── responseHelpers.js  # Standardized API responses
└── app.js          # Express app configuration
```

## Key Features

### 1. Configuration Management
- Environment-based configuration using `process.env`
- Centralized config file at `src/config/index.js`
- All secrets and settings configurable via environment variables

### 2. Modular Architecture
- **Controllers**: Handle request logic and business operations
- **Models**: Data access layer with static methods
- **Routes**: Clean route definitions with proper middleware
- **Middleware**: Reusable authentication and error handling

### 3. Error Handling
- Centralized error handling middleware
- Async error wrapper for clean error propagation
- Consistent error response format
- Environment-specific error details

### 4. Response Standardization
- Consistent API response format
- Helper functions for common response patterns
- Status code standardization

### 5. Authentication
- JWT-based authentication
- Session management
- Protected route middleware
- Configurable token expiration

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRATION=1h
SESSION_SECRET=your_session_secret
SESSION_MAX_AGE=3600000
SESSION_SECURE=false
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /customer/register` - User registration
- `POST /customer/login` - User login
- `POST /customer/logout` - User logout (authenticated)

### Books
- `GET /` - Get all books
- `GET /isbn/:isbn` - Get book by ISBN
- `GET /author/:author` - Get books by author
- `GET /title/:title` - Get books by title
- `GET /review/:isbn` - Get book reviews
- `PUT /auth/review/:isbn` - Add/update review (authenticated)
- `DELETE /auth/review/:isbn` - Delete review (authenticated)

## Response Format

All API responses follow this standardized format:

```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": {...}  // Only present in successful responses
}
```

## Error Handling

Errors are handled centrally and return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": {...}  // Only in development mode
}
```

## Running the Application

```bash
# Development mode
npm start

# Production mode
npm run start:prod

# Run tests
npm test
```

## Module System

The project uses CommonJS modules consistently throughout the codebase for compatibility with the existing Node.js environment.
