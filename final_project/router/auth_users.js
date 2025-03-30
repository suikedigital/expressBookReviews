const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username exists in the users array.
const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required." });
    }

    // Check if the username already exists
    if (isValid(username)) {
        return res.status(400).json({ message: "Username already exists." });
    }

    // Add the new user to the array
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully!" });
});

// Login user and generate JWT
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required." });
    }

    // Check if the username exists
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).json({ message: "Username not found." });
    }

    // Check if the password matches
    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ username }, 'idiot', { expiresIn: '1h' });
    req.session.authorization = {accessToken: token };

    return res.status(200).json({ message: "Login successful", token });
});

// Protect routes with authentication
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    // Bearer <token>
    const tokenString = token.split(' ')[1]; // Extract the token part after "Bearer"

    jwt.verify(tokenString, 'idiot', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }

        req.user = decoded; // Attach decoded user info to the request
        next(); // Proceed to the next middleware or route
    });
};

// Add a book review (requires authentication)
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    // Add the review to the book's reviews
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    books[isbn].reviews[req.user.username] = review;

    return res.status(200).json({ message: "Review added successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
