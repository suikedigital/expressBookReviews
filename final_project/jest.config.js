module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.js', '**/__tests__/**/*.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    'router/**/*.js',
    'index.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testTimeout: 10000
};
