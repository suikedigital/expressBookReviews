const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:"fraser", password:"pass1"},];

// Check if the username exists in the users array.
const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenicatedUser = (username,password)=>{ 
    const user = users.find(u => u.username === username)
    if (user && user.password === password) {
        return true;
    } else { 
        return false;
    }
};

// Login user and generate JWT
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required." });
    }

    const isAuthenicated = authenicatedUser(username, password)
    if (!isAuthenicated) {
        return res.status(401).json({ message: "Invalid username and password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

    req.session.authorization = { accessToken: token };
    
    req.session.save(err => {
        if (err) {
            console.log("Session save error:", err);
        }
    });
    
    return res.status(200).json({ message: "Login successful", token });
});

// Add a book review (requires authentication)
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!req.session || !req.session.authorization || !req.session.authorization.accessToken) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    
    const token = req.session.authorization.accessToken;
    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated" });
        }

    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    // Add the review to the book's reviews
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }
    books[isbn].reviews[user.username] = review;

    return res.status(200).json({ message: "Review added successfully." });
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    if (!req.session || !req.session.authorization || !req.session.authorization.accessToken) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    
    const token = req.session.authorization.accessToken;

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) { 
            return res.status(403).json({ message: "User not authenticated" });
        }
    
        const isbn = req.params.isbn;
        const username = user.username; 

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (books[isbn].reviews && books[isbn].reviews[username]) {
            // User has reviewed this book, so delete the review
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Your review has been deleted successfully." });
        } else { 
            return res.status(404).json({ message: "You have not reviewed this book yet." });
        }
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
