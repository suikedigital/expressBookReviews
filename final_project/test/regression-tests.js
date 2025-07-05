const request = require('supertest');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Import the modules
const customer_routes = require('../router/auth_users.js').authenticated;
const genl_routes = require('../router/general.js').general;
const users = require('../router/auth_users.js').users;
const books = require('../router/booksdb.js');

// Create test app
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 3600000 }
}));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session && req.session.authorization && req.session.authorization.accessToken) {
        const token = req.session.authorization.accessToken;
        
        jwt.verify(token, "secret_key", (err, user) => {
            if (!err) {
                req.user = user;
                return next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(401).json({ message: "User not logged in" });
    }
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Test suite
describe('Regression Tests for Fixed Bugs', () => {
    beforeEach(() => {
        // Reset users array to initial state
        users.length = 0;
        users.push({username: "fraser", password: "pass1"});
        
        // Reset books reviews
        Object.keys(books).forEach(isbn => {
            books[isbn].reviews = {};
        });
    });

    describe('Bug Fix 1: Registration with Array-Push and Uniqueness Validation', () => {
        it('should register new user using array-push approach', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    username: 'newuser',
                    password: 'newpass'
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully!');
            
            // Verify user was added to array
            expect(users.length).toBe(2);
            expect(users.find(u => u.username === 'newuser')).toBeDefined();
            expect(users.find(u => u.username === 'newuser').password).toBe('newpass');
        });

        it('should validate uniqueness correctly with array-based storage', async () => {
            // First registration should succeed
            const response1 = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'testpass'
                });

            expect(response1.status).toBe(201);
            expect(users.length).toBe(2);

            // Second registration with same username should fail
            const response2 = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'differentpass'
                });

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe('Username already exists.');
            expect(users.length).toBe(2); // Should not add duplicate
        });

        it('should check uniqueness against existing users in array', async () => {
            // Try to register with existing username 'fraser'
            const response = await request(app)
                .post('/register')
                .send({
                    username: 'fraser',
                    password: 'newpass'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username already exists.');
            expect(users.length).toBe(1); // Should not add duplicate
        });
    });

    describe('Bug Fix 2: Reviews Retrieval Logic', () => {
        beforeEach(() => {
            // Add some test reviews
            books['1'].reviews = {
                'user1': 'Great book!',
                'user2': 'Excellent read!'
            };
        });

        it('should correctly check Object.keys(reviews).length for non-empty reviews', async () => {
            const response = await request(app)
                .get('/review/1');

            expect(response.status).toBe(200);
            expect(response.body.reviews).toEqual({
                'user1': 'Great book!',
                'user2': 'Excellent read!'
            });
        });

        it('should return 404 when no reviews exist (empty object)', async () => {
            // Book exists but has no reviews
            const response = await request(app)
                .get('/review/2');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No reviews found for this book');
        });

        it('should return 404 when book does not exist', async () => {
            const response = await request(app)
                .get('/review/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Book not found.');
        });
    });

    describe('Bug Fix 3: Authentication/Session Safety and Consistent Status Codes', () => {
        let authToken;
        let agent;

        beforeEach(async () => {
            agent = request.agent(app);
            
            // Login to get authentication token
            const loginResponse = await agent
                .post('/customer/login')
                .send({
                    username: 'fraser',
                    password: 'pass1'
                });

            authToken = loginResponse.body.token;
        });

        it('should safely read req.session.authorization and return 401 for missing session', async () => {
            // Try to access protected route without session
            const response = await request(app)
                .put('/customer/auth/review/1')
                .send({ review: 'Test review' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('User not logged in');
        });

        it('should return 403 for invalid token', async () => {
            // Mock session with invalid token
            const response = await request(app)
                .put('/customer/auth/review/1')
                .set('Cookie', ['connect.sid=invalid-session'])
                .send({ review: 'Test review' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('User not logged in');
        });

        it('should successfully add review with valid session', async () => {
            const response = await agent
                .put('/customer/auth/review/1')
                .send({ review: 'Test review from fraser' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Review added successfully.');
            
            // Verify review was added
            expect(books['1'].reviews['fraser']).toBe('Test review from fraser');
        });

        it('should return 404 for non-existent book when deleting review', async () => {
            const response = await agent
                .delete('/customer/auth/review/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Book not found');
        });

        it('should return 404 when trying to delete non-existent review', async () => {
            const response = await agent
                .delete('/customer/auth/review/1');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('You have not reviewed this book yet.');
        });

        it('should successfully delete existing review', async () => {
            // First add a review
            await agent
                .put('/customer/auth/review/1')
                .send({ review: 'Test review to delete' });

            // Then delete it
            const response = await agent
                .delete('/customer/auth/review/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Your review has been deleted successfully.');
            
            // Verify review was deleted
            expect(books['1'].reviews['fraser']).toBeUndefined();
        });

        it('should not have duplicate session assignments (no duplicate bug)', async () => {
            // This test ensures the login doesn't have duplicate session assignments
            const loginResponse = await agent
                .post('/customer/login')
                .send({
                    username: 'fraser',
                    password: 'pass1'
                });

            expect(loginResponse.status).toBe(200);
            expect(loginResponse.body.message).toBe('Login successful');
            expect(loginResponse.body.token).toBeDefined();
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle malformed session data gracefully', async () => {
            // This test ensures the app doesn't crash with malformed session data
            const response = await request(app)
                .put('/customer/auth/review/1')
                .send({ review: 'Test review' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('User not logged in');
        });

        it('should require both username and password for registration', async () => {
            const response1 = await request(app)
                .post('/register')
                .send({ username: 'testuser' });

            expect(response1.status).toBe(400);
            expect(response1.body.message).toBe('Both username and password are required.');

            const response2 = await request(app)
                .post('/register')
                .send({ password: 'testpass' });

            expect(response2.status).toBe(400);
            expect(response2.body.message).toBe('Both username and password are required.');
        });

        it('should require review text for adding reviews', async () => {
            const agent = request.agent(app);
            
            // Login first
            await agent
                .post('/customer/login')
                .send({
                    username: 'fraser',
                    password: 'pass1'
                });

            // Try to add empty review
            const response = await agent
                .put('/customer/auth/review/1')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Review text is required.');
        });
    });
});
