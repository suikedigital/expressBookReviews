// Global test setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.SESSION_SECRET = 'test_session_secret';
process.env.BCRYPT_SALT_ROUNDS = '4'; // Lower for faster tests

// Disable console.log in tests unless explicitly needed
if (process.env.JEST_VERBOSE !== 'true') {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
}

// Mock external dependencies if needed
jest.setTimeout(10000);

// Test to ensure setup works
describe('Test Setup', () => {
  it('should have test environment configured', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBe('test_jwt_secret');
  });
});
