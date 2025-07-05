const jwt = require('jsonwebtoken');
const authController = require('../../src/controllers/authController');
const { sendSuccess, sendError, sendValidationError, sendUnauthorized } = require('../../src/utils/responseHelpers');

// Mock dependencies
jest.mock('../../src/models/User');
jest.mock('../../src/config', () => ({
  jwtSecret: 'test_secret',
  jwtExpiration: '1h'
}));
jest.mock('../../src/utils/responseHelpers');

const User = require('../../src/models/User');

describe('Auth Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      session: {
        save: jest.fn(callback => callback()),
        destroy: jest.fn(callback => callback())
      }
    };
    mockRes = {};
    mockNext = jest.fn();
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = {
        username: 'newuser',
        password: 'password123'
      };

      User.exists.mockReturnValue(false);
      User.create.mockResolvedValue(true);

      await authController.register(mockReq, mockRes, mockNext);

      expect(User.exists).toHaveBeenCalledWith('newuser');
      expect(User.create).toHaveBeenCalledWith('newuser', 'password123');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, null, 'User registered successfully!', 201);
    });

    it('should return error if username already exists', async () => {
      mockReq.body = {
        username: 'existinguser',
        password: 'password123'
      };

      User.exists.mockReturnValue(true);

      await authController.register(mockReq, mockRes, mockNext);

      expect(User.exists).toHaveBeenCalledWith('existinguser');
      expect(User.create).not.toHaveBeenCalled();
      expect(sendValidationError).toHaveBeenCalledWith(mockRes, 'Username already exists');
    });

    it('should return error if user creation fails', async () => {
      mockReq.body = {
        username: 'newuser',
        password: 'password123'
      };

      User.exists.mockReturnValue(false);
      User.create.mockResolvedValue(false);

      await authController.register(mockReq, mockRes, mockNext);

      expect(sendError).toHaveBeenCalledWith(mockRes, 'Failed to register user', 500);
    });

    it('should handle errors gracefully', async () => {
      mockReq.body = {
        username: 'newuser',
        password: 'password123'
      };

      const error = new Error('Database error');
      User.exists.mockImplementation(() => {
        throw error;
      });

      await authController.register(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      mockReq.body = {
        username: 'testuser',
        password: 'password123'
      };

      User.authenticate.mockResolvedValue(true);

      await authController.login(mockReq, mockRes, mockNext);

      expect(User.authenticate).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockReq.session.authorization).toBeDefined();
      expect(mockReq.session.authorization.accessToken).toBeDefined();
      expect(mockReq.session.save).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(
        mockRes, 
        { token: expect.any(String) }, 
        'Login successful'
      );
    });

    it('should generate valid JWT token', async () => {
      mockReq.body = {
        username: 'testuser',
        password: 'password123'
      };

      User.authenticate.mockResolvedValue(true);

      await authController.login(mockReq, mockRes, mockNext);

      const token = mockReq.session.authorization.accessToken;
      const decoded = jwt.verify(token, 'test_secret');
      
      expect(decoded.username).toBe('testuser');
      expect(decoded.exp).toBeDefined();
    });

    it('should return unauthorized for invalid credentials', async () => {
      mockReq.body = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      User.authenticate.mockResolvedValue(false);

      await authController.login(mockReq, mockRes, mockNext);

      expect(User.authenticate).toHaveBeenCalledWith('testuser', 'wrongpassword');
      expect(mockReq.session.authorization).toBeUndefined();
      expect(sendUnauthorized).toHaveBeenCalledWith(mockRes, 'Invalid username or password');
    });

    it('should handle session save errors', async () => {
      mockReq.body = {
        username: 'testuser',
        password: 'password123'
      };
      
      mockReq.session.save = jest.fn(callback => callback('Session error'));
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      User.authenticate.mockResolvedValue(true);

      await authController.login(mockReq, mockRes, mockNext);

      expect(consoleSpy).toHaveBeenCalledWith('Session save error:', 'Session error');
      expect(sendSuccess).toHaveBeenCalled(); // Should still succeed

      consoleSpy.mockRestore();
    });

    it('should handle authentication errors gracefully', async () => {
      mockReq.body = {
        username: 'testuser',
        password: 'password123'
      };

      const error = new Error('Auth error');
      User.authenticate.mockRejectedValue(error);

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      await authController.logout(mockReq, mockRes, mockNext);

      expect(mockReq.session.destroy).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, null, 'Logout successful');
    });

    it('should handle session destroy errors', async () => {
      mockReq.session.destroy = jest.fn(callback => callback('Destroy error'));

      await authController.logout(mockReq, mockRes, mockNext);

      expect(sendError).toHaveBeenCalledWith(mockRes, 'Could not log out', 500);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Logout error');
      mockReq.session.destroy = jest.fn(() => {
        throw error;
      });

      await authController.logout(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete auth flow', async () => {
      // Register
      mockReq.body = { username: 'flowuser', password: 'flowpass' };
      User.exists.mockReturnValue(false);
      User.create.mockResolvedValue(true);

      await authController.register(mockReq, mockRes, mockNext);
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, null, 'User registered successfully!', 201);

      // Login
      jest.clearAllMocks();
      User.authenticate.mockResolvedValue(true);

      await authController.login(mockReq, mockRes, mockNext);
      expect(sendSuccess).toHaveBeenCalledWith(
        mockRes, 
        { token: expect.any(String) }, 
        'Login successful'
      );

      // Logout
      jest.clearAllMocks();

      await authController.logout(mockReq, mockRes, mockNext);
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, null, 'Logout successful');
    });
  });
});
