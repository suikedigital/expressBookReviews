const {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden
} = require('../../src/utils/responseHelpers');

describe('Response Helpers', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('sendSuccess', () => {
    it('should send success response with default values', () => {
      const data = { id: 1, name: 'Test' };
      
      sendSuccess(mockRes, data);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: data
      });
    });

    it('should send success response with custom message and status code', () => {
      const data = { id: 1, name: 'Test' };
      const message = 'Created successfully';
      const statusCode = 201;
      
      sendSuccess(mockRes, data, message, statusCode);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: message,
        data: data
      });
    });

    it('should send success response with null data', () => {
      sendSuccess(mockRes, null, 'Operation completed');
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Operation completed',
        data: null
      });
    });
  });

  describe('sendError', () => {
    it('should send error response with default values', () => {
      sendError(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'An error occurred'
      });
    });

    it('should send error response with custom message and status code', () => {
      const message = 'Bad request';
      const statusCode = 400;
      
      sendError(mockRes, message, statusCode);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: message
      });
    });

    it('should include error details in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Test error');
      sendError(mockRes, 'Something went wrong', 500, error);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
        error: error
      });
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not include error details in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const error = new Error('Test error');
      sendError(mockRes, 'Something went wrong', 500, error);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong'
      });
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('sendValidationError', () => {
    it('should send validation error with default values', () => {
      sendValidationError(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: []
      });
    });

    it('should send validation error with custom message and errors', () => {
      const message = 'Invalid input';
      const errors = ['Field is required', 'Invalid format'];
      
      sendValidationError(mockRes, message, errors);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: message,
        errors: errors
      });
    });
  });

  describe('sendNotFound', () => {
    it('should send not found response with default message', () => {
      sendNotFound(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found'
      });
    });

    it('should send not found response with custom message', () => {
      const message = 'User not found';
      
      sendNotFound(mockRes, message);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: message
      });
    });
  });

  describe('sendUnauthorized', () => {
    it('should send unauthorized response with default message', () => {
      sendUnauthorized(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized'
      });
    });

    it('should send unauthorized response with custom message', () => {
      const message = 'Invalid credentials';
      
      sendUnauthorized(mockRes, message);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: message
      });
    });
  });

  describe('sendForbidden', () => {
    it('should send forbidden response with default message', () => {
      sendForbidden(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Forbidden'
      });
    });

    it('should send forbidden response with custom message', () => {
      const message = 'Access denied';
      
      sendForbidden(mockRes, message);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: message
      });
    });
  });
});
