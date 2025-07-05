# Bug Fixes Summary

This document summarizes the core functional bugs that were fixed and the regression tests that prove each fix is working correctly.

## 🐛 Fixed Bugs

### 1. Registration Bug: Object-style User Storage
**Problem**: The registration function was using object-style storage (`users[username] = { password: password }`) instead of array-push approach, and uniqueness validation was incorrect.

**Location**: `/router/general.js` - `POST /register` endpoint

**Fix**:
- Changed from object-style storage to array-push approach: `users.push({ username: username, password: password })`
- Fixed uniqueness validation to work with array: `users.some(user => user.username === username)`

**Before**:
```javascript
if (users[username]) {
  return res.status(400).json({ message: "Username already exists." });
}
users[username] = { password: password };
```

**After**:
```javascript
if (users.some(user => user.username === username)) {
  return res.status(400).json({ message: "Username already exists." });
}
users.push({ username: username, password: password });
```

### 2. Reviews Retrieval Bug: Incorrect Length Check
**Problem**: In `/review/:isbn` route, the code was checking `reviews.length` instead of `Object.keys(reviews).length`, which doesn't work for objects.

**Location**: `/router/general.js` - `GET /review/:isbn` endpoint

**Fix**:
- Changed from `reviews.length > 0` to `Object.keys(reviews).length > 0`

**Before**:
```javascript
if (reviews.length > 0) {
    return res.status(200).json({reviews: reviews})
}
```

**After**:
```javascript
if (Object.keys(reviews).length > 0) {
    return res.status(200).json({reviews: reviews})
}
```

### 3. Authentication/Session Bugs: Multiple Issues
**Problem**: Several authentication and session-related bugs were present:
- Unsafe reading of `req.session.authorization`
- Duplicate session assignments in login
- Inconsistent 401/403 status codes

**Locations**: 
- `/router/auth_users.js` - login endpoint and review endpoints
- `/index.js` - authentication middleware

**Fixes**:

#### a) Removed Duplicate Session Assignment
**Before**:
```javascript
req.session.authorization = { accessToken: token };
console.log("Before saving session:", req.session);
req.session.authorization = { accessToken: token }; // DUPLICATE!
```

**After**:
```javascript
req.session.authorization = { accessToken: token };
```

#### b) Safe Session Reading
**Before**:
```javascript
const token = req.session.authorization['accessToken']; // UNSAFE!
```

**After**:
```javascript
if (!req.session || !req.session.authorization || !req.session.authorization.accessToken) {
    return res.status(401).json({ message: "User not authenticated" });
}
const token = req.session.authorization.accessToken;
```

#### c) Consistent Status Codes
- Changed authentication middleware to return 401 for missing session (not logged in) and 403 for invalid token
- Fixed delete review endpoint to return 404 for non-existent book/review instead of 403

## 🧪 Regression Tests

### Test File: `/test/regression-tests.js`

All 16 regression tests are passing, proving each bug is fixed:

#### Bug Fix 1 Tests (Registration):
- ✅ `should register new user using array-push approach`
- ✅ `should validate uniqueness correctly with array-based storage`
- ✅ `should check uniqueness against existing users in array`

#### Bug Fix 2 Tests (Reviews Retrieval):
- ✅ `should correctly check Object.keys(reviews).length for non-empty reviews`
- ✅ `should return 404 when no reviews exist (empty object)`
- ✅ `should return 404 when book does not exist`

#### Bug Fix 3 Tests (Authentication/Session):
- ✅ `should safely read req.session.authorization and return 401 for missing session`
- ✅ `should return 403 for invalid token`
- ✅ `should successfully add review with valid session`
- ✅ `should return 404 for non-existent book when deleting review`
- ✅ `should return 404 when trying to delete non-existent review`
- ✅ `should successfully delete existing review`
- ✅ `should not have duplicate session assignments (no duplicate bug)`

#### Edge Cases and Error Handling:
- ✅ `should handle malformed session data gracefully`
- ✅ `should require both username and password for registration`
- ✅ `should require review text for adding reviews`

## 🚀 Running the Tests

To run the regression tests:

```bash
npm install
npm run test:regression
```

Or to run all tests:

```bash
npm test
```

## 📋 Test Results

```
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        0.505 s
```

All tests pass, confirming that:
1. ✅ Registration now uses array-push and validates uniqueness correctly
2. ✅ Reviews retrieval logic checks object length properly
3. ✅ Authentication/session handling is safe and uses consistent status codes
4. ✅ No regression bugs were introduced during the fixes

## 🔧 Additional Improvements

The fixes also included:
- Better error handling and input validation
- Consistent HTTP status code usage (401 for unauthorized, 403 for forbidden, 404 for not found)
- Safer session data access patterns
- Removal of duplicate code and assignments

These changes improve the overall robustness, security, and maintainability of the application.
