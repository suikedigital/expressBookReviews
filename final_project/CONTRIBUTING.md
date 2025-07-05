# Contributing to Book Review API

First off, thank you for considering contributing to the Book Review API! It's people like you that make this project a great tool for managing book reviews.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guides](#style-guides)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- Git
- A text editor or IDE (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/book-review-api.git
   cd book-review-api/final_project
   ```

2. **Add the original repository as upstream**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/book-review-api.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include details about your configuration and environment**

#### Bug Report Template

```markdown
**Bug Description:**
A clear and concise description of what the bug is.

**To Reproduce:**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
A clear description of what you expected to happen.

**Screenshots:**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. macOS, Ubuntu]
- Node.js version: [e.g. 14.17.0]
- npm version: [e.g. 6.14.13]
- API version: [e.g. 1.0.1]

**Additional Context:**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how the enhancement would be used**

### Code Contributions

#### Good First Issues

Look for issues labeled `good first issue` or `help wanted`. These are typically:
- Documentation improvements
- Small bug fixes
- Adding tests
- Refactoring existing code

#### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes following our style guides**

3. **Add or update tests as needed**

4. **Update documentation if required**

5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Create a Pull Request**

## 🔧 Development Setup

### Project Structure

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers and business logic
├── middleware/       # Custom middleware functions
├── models/           # Data models and database operations
├── routes/           # Route definitions
├── utils/            # Utility functions
└── app.js           # Express app configuration
```

### Environment Variables

Required environment variables for development:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_development_jwt_secret
JWT_EXPIRATION=1h
SESSION_SECRET=your_development_session_secret
SESSION_MAX_AGE=3600000
SESSION_SECURE=false
```

### Development Commands

```bash
# Start development server with hot reload
npm start

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

# Start production server
npm run start:prod
```

## 📥 Pull Request Process

### Before Submitting

1. **Update documentation** if you're changing APIs or adding features
2. **Add tests** for new functionality
3. **Ensure all tests pass** locally
4. **Follow the coding style** guidelines
5. **Update the CHANGELOG.md** with your changes

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Testing** in a staging environment if applicable
4. **Documentation review** if docs were changed
5. **Final approval** and merge by maintainer

## 📝 Style Guides

### JavaScript Style Guide

We follow these guidelines:

- **Use ES6+ features** where appropriate
- **Prefer `const` and `let`** over `var`
- **Use meaningful variable names**
- **Add JSDoc comments** for functions and classes
- **Follow the existing code formatting**

#### Code Formatting

```javascript
/**
 * Calculate the average rating for a book
 * @param {Object} reviews - The reviews object
 * @returns {number} The average rating
 */
const calculateAverageRating = (reviews) => {
    const ratings = Object.values(reviews)
        .map(review => review.rating)
        .filter(rating => rating !== undefined);
    
    if (ratings.length === 0) {
        return 0;
    }
    
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
};
```

### Commit Message Guidelines

Use the conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```
feat(auth): add JWT token refresh functionality
fix(books): resolve ISBN validation error
docs(api): update authentication examples
test(controllers): add unit tests for book controller
```

### API Documentation

- **Use JSDoc** for inline documentation
- **Add Swagger annotations** for API endpoints
- **Include examples** in documentation
- **Keep documentation up to date** with code changes

## 🧪 Testing

### Test Structure

```
test/
├── controllers/      # Controller unit tests
├── models/          # Model unit tests
├── utils/           # Utility function tests
├── integration/     # API integration tests
├── regression/      # Regression tests
└── setup.js        # Test setup and configuration
```

### Writing Tests

- **Write descriptive test names**
- **Test both success and error cases**
- **Use appropriate test data**
- **Mock external dependencies**
- **Aim for high test coverage**

#### Test Example

```javascript
describe('Book Controller', () => {
    describe('getAllBooks', () => {
        it('should return all books successfully', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Books retrieved successfully',
                data: { books: expect.any(Object) }
            });
        });
    });
});
```

### Test Coverage Requirements

- **Minimum 80% coverage** for new code
- **All new functions** must have tests
- **Critical paths** should have 100% coverage
- **Edge cases** should be tested

## 📚 Documentation

### Types of Documentation

1. **API Documentation** - Swagger/OpenAPI specs
2. **Code Documentation** - JSDoc comments
3. **User Documentation** - README, guides
4. **Developer Documentation** - Architecture, contributing

### Documentation Standards

- **Keep it current** - Update docs with code changes
- **Be clear and concise** - Use simple language
- **Provide examples** - Show how to use features
- **Use consistent formatting** - Follow markdown standards

## 👥 Community

### Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and general discussion
- **Wiki** - For detailed documentation and guides

### Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

### Recognition

Contributors are recognized in:
- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to the Book Review API! 🎉
