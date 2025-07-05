const bcrypt = require('bcryptjs');

// Mock the User model to avoid side effects
jest.mock('../../src/config', () => ({
  bcryptSaltRounds: 4
}));

// Reset the module cache and reimport User for each test
let User;

describe('User Model', () => {
  beforeEach(() => {
    // Clear the module cache
    delete require.cache[require.resolve('../../src/models/User')];
    // Import fresh User model
    User = require('../../src/models/User');
    
    // Clear users array (access internal state for testing)
    const users = User.getAll();
    users.length = 0;
  });

  describe('getAll', () => {
    it('should return all users', () => {
      const users = User.getAll();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('findByUsername', () => {
    it('should return user if found', async () => {
      await User.create('testuser', 'testpass');
      const user = User.findByUsername('testuser');
      
      expect(user).toBeTruthy();
      expect(user.username).toBe('testuser');
    });

    it('should return undefined if user not found', () => {
      const user = User.findByUsername('nonexistent');
      expect(user).toBeUndefined();
    });
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      await User.create('testuser', 'testpass');
      expect(User.exists('testuser')).toBe(true);
    });

    it('should return false if user does not exist', () => {
      expect(User.exists('nonexistent')).toBe(false);
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const result = await User.create('newuser', 'password123');
      
      expect(result).toBe(true);
      expect(User.exists('newuser')).toBe(true);
      
      const user = User.findByUsername('newuser');
      expect(user.username).toBe('newuser');
      expect(user.password).not.toBe('password123'); // Should be hashed
    });

    it('should hash the password before storing', async () => {
      const password = 'plaintext123';
      await User.create('hashtest', password);
      
      const user = User.findByUsername('hashtest');
      expect(user.password).not.toBe(password);
      
      // Verify it's a bcrypt hash
      const isValidHash = await bcrypt.compare(password, user.password);
      expect(isValidHash).toBe(true);
    });

    it('should not create user if username already exists', async () => {
      await User.create('duplicate', 'password1');
      const result = await User.create('duplicate', 'password2');
      
      expect(result).toBe(false);
      
      const users = User.getAll();
      const duplicateUsers = users.filter(u => u.username === 'duplicate');
      expect(duplicateUsers).toHaveLength(1);
    });

    it('should handle bcrypt errors gracefully', async () => {
      // Mock bcrypt.hash to throw an error
      const originalHash = bcrypt.hash;
      bcrypt.hash = jest.fn().mockRejectedValue(new Error('Hash failed'));
      
      const result = await User.create('erroruser', 'password');
      
      expect(result).toBe(false);
      expect(User.exists('erroruser')).toBe(false);
      
      // Restore original function
      bcrypt.hash = originalHash;
    });
  });

  describe('authenticate', () => {
    beforeEach(async () => {
      await User.create('authtest', 'correctpassword');
    });

    it('should authenticate user with correct credentials', async () => {
      const result = await User.authenticate('authtest', 'correctpassword');
      expect(result).toBe(true);
    });

    it('should reject authentication with incorrect password', async () => {
      const result = await User.authenticate('authtest', 'wrongpassword');
      expect(result).toBe(false);
    });

    it('should reject authentication for non-existent user', async () => {
      const result = await User.authenticate('nonexistent', 'anypassword');
      expect(result).toBe(false);
    });

    it('should handle bcrypt compare errors gracefully', async () => {
      // Mock bcrypt.compare to throw an error
      const originalCompare = bcrypt.compare;
      bcrypt.compare = jest.fn().mockRejectedValue(new Error('Compare failed'));
      
      const result = await User.authenticate('authtest', 'correctpassword');
      
      expect(result).toBe(false);
      
      // Restore original function
      bcrypt.compare = originalCompare;
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple users correctly', async () => {
      await User.create('user1', 'pass1');
      await User.create('user2', 'pass2');
      await User.create('user3', 'pass3');
      
      expect(User.getAll()).toHaveLength(3);
      expect(User.exists('user1')).toBe(true);
      expect(User.exists('user2')).toBe(true);
      expect(User.exists('user3')).toBe(true);
      
      expect(await User.authenticate('user1', 'pass1')).toBe(true);
      expect(await User.authenticate('user2', 'pass2')).toBe(true);
      expect(await User.authenticate('user3', 'pass3')).toBe(true);
      
      expect(await User.authenticate('user1', 'pass2')).toBe(false);
    });

    it('should maintain data integrity across operations', async () => {
      // Create users
      await User.create('john', 'johnpass');
      await User.create('jane', 'janepass');
      
      // Try to create duplicate (should fail)
      const duplicateResult = await User.create('john', 'newpass');
      expect(duplicateResult).toBe(false);
      
      // Original password should still work
      expect(await User.authenticate('john', 'johnpass')).toBe(true);
      expect(await User.authenticate('john', 'newpass')).toBe(false);
      
      // Other user should be unaffected
      expect(await User.authenticate('jane', 'janepass')).toBe(true);
    });
  });
});
