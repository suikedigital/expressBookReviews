# Testing Documentation

## Overview

This project has been set up with comprehensive automated testing using Jest and Supertest to ensure code quality and functionality. The test suite includes unit tests, integration tests, and regression tests with a target of ≥80% code coverage.

## Testing Framework

- **Jest**: JavaScript testing framework for unit tests and test runner
- **Supertest**: HTTP assertion library for testing Express.js applications
- **Coverage**: Code coverage reporting with threshold enforcement

## Test Structure

```
test/
├── setup.js                           # Global test configuration
├── utils/
│   └── responseHelpers.test.js       # Unit tests for response utilities
├── models/
│   ├── User.test.js                   # Unit tests for User model
│   └── Book.test.js                   # Unit tests for Book model
├── controllers/
│   ├── authController.test.js         # Unit tests for auth controller
│   └── booksController.test.js        # Unit tests for books controller
├── integration/
│   └── auth-fixed.test.js            # Integration tests for auth endpoints
└── regression-tests.js               # Regression tests for bug fixes
```

## Running Tests

### All Tests
```bash
npm test
```

### With Coverage Report
```bash
npm run test:coverage
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Regression Tests Only
```bash
npm run test:regression
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### CI/CD Tests
```bash
npm run test:ci
```

## Coverage Metrics

Current coverage (as of last run):
- **Statements**: 81.34%
- **Branches**: 68.75%
- **Functions**: 82.35%
- **Lines**: 81.23%

### Coverage Threshold
The project is configured with a minimum coverage threshold of 80% for:
- Statements
- Branches
- Functions
- Lines

## Test Categories

### 1. Unit Tests

#### Response Helpers (`test/utils/responseHelpers.test.js`)
- Tests all response helper functions
- Covers success, error, validation, and status responses
- Tests environment-specific behavior

#### User Model (`test/models/User.test.js`)
- Tests user creation, authentication, and validation
- Covers password hashing and comparison
- Tests error handling and edge cases

#### Book Model (`test/models/Book.test.js`)
- Tests CRUD operations for books and reviews
- Covers search functionality (by author, title, ISBN)
- Tests data integrity and error scenarios

#### Controllers (`test/controllers/`)
- **Auth Controller**: Registration, login, logout functionality
- **Books Controller**: Book retrieval and review management
- Mocked dependencies for isolated testing

### 2. Integration Tests

#### Authentication Flow (`test/integration/auth-fixed.test.js`)
- End-to-end testing of auth endpoints
- Tests complete register-login-logout flow
- Validates security headers and session management
- Handles rate limiting scenarios

### 3. Regression Tests

#### Bug Fix Validation (`test/regression-tests.js`)
- Tests for previously fixed bugs
- Ensures registration with array-push approach works
- Validates review retrieval logic
- Tests authentication and session safety

## Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
{
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.js', '**/__tests__/**/*.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    'router/**/*.js',
    'index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### Test Setup (`test/setup.js`)
- Configures test environment variables
- Sets up mocks for external dependencies
- Configures timeouts and logging

## GitHub Actions Integration

The project includes GitHub Actions workflow (`.github/workflows/test.yml`) that:
- Runs tests on Node.js 18.x and 20.x
- Executes on push/PR to main and develop branches
- Runs unit tests, integration tests, and regression tests
- Generates and uploads coverage reports
- Performs security audits

### Workflow Jobs
1. **Test**: Main test suite with coverage
2. **Integration Test**: Focused integration testing
3. **Security Audit**: npm audit for vulnerabilities

## Testing Best Practices Implemented

### 1. **Isolation**
- Each test is isolated with proper setup/teardown
- Mocked dependencies prevent external calls
- Fresh state for each test run

### 2. **Comprehensive Coverage**
- Unit tests for all utility functions and models
- Integration tests for API endpoints
- Error handling and edge case coverage

### 3. **Realistic Scenarios**
- Tests use realistic data and scenarios
- Authentication flows mirror real usage
- Rate limiting and security headers tested

### 4. **Maintainable Structure**
- Clear test organization by feature
- Descriptive test names and grouping
- Reusable test helpers and setup

## Test Data and Mocking

### Mocked Dependencies
- User model with in-memory storage
- Book model with predefined test data
- Response helpers for consistent API responses
- JWT tokens with test secrets

### Test Environment
- Separate test configuration
- Reduced bcrypt rounds for performance
- Disabled console logging during tests
- Test-specific timeouts and settings

## Coverage Reports

Coverage reports are generated in multiple formats:
- **Text**: Console output during test runs
- **HTML**: Detailed interactive report in `coverage/` directory
- **LCOV**: For integration with coverage services
- **JSON**: Machine-readable format for CI/CD

## Future Enhancements

To reach 90%+ coverage, consider adding:
1. Tests for error handlers and middleware
2. More edge cases for security features
3. Performance and load testing
4. End-to-end browser testing (if frontend is added)
5. Database integration tests (when real DB is implemented)

## Running Tests Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run all tests**:
   ```bash
   npm test
   ```

3. **View coverage report**:
   ```bash
   npm run test:coverage
   open coverage/lcov-report/index.html
   ```

## Continuous Integration

The test suite is configured to run automatically on:
- Every push to main/develop branches
- Pull requests to main/develop branches
- Multiple Node.js versions (18.x, 20.x)

Tests must pass for merges to be allowed, ensuring code quality and preventing regressions.
