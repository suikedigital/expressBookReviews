const express = require('express');
let books = require("./booksdb.js");
const { default: axios } = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
  
    // check if username and password are provided.
    if (!username || !password) {
      return res.status(400).json({ message: "Both username and password are required." });
    } 
    
    // Check uniqueness correctly with array-based storage
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Use array-push approach instead of object-style storage
    users.push({ username: username, password: password });
  
    return res.status(201).json({ message: "User registered successfully!" });
  });

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try { 
    
      // const response = await axios.get('http://example.com/api/books'); 
      // Uncomment if using a real API

      return res.status(200).json({ books: books });
      
    } catch (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({ message: 'Error fetching books.' });
    }
  });
  

// Get book details based on ISBN

public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      // const response = await axios.get(`http://example.com/api/books/${isbn}`);
      // Uncomment if using a real API

      if (books[isbn]) {
        return res.status(200).json(books[isbn]);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
  
    } catch (error) {
      console.error('Error fetching book details:', error);
      return res.status(500).json({ message: 'Error fetching book details.' });
    }
  });
  
  public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
      // const response = await axios.get(`http://example.com/api/books/author/${author}`);
      // Uncomment if using a real API
      let booksByAuthor = [];

      for (let key in books) {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      }
  
      // If books are found by the given author, return them
      if (booksByAuthor.length > 0) {
        return res.status(200).json({ books: booksByAuthor });
      } else {
        return res.status(404).json({ message: "Author not found" });
      }
  
    } catch (error) {
      console.error('Error fetching books by author:', error);
      return res.status(500).json({ message: 'Error fetching books by author.' });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {
      // const resppnse = await axios.get(`http://example.com/api/books/title/${title}`);

      let booksByTitle = [];
  
      for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push(books[key]);
        }
      }
  
      // If books are found by the given title, return them
      if (booksByTitle.length > 0) {
        return res.status(200).json({ books: booksByTitle });
      } else {
        return res.status(404).json({ message: "Title not found" });
      }
  
    } catch (error) {
      console.error('Error fetching books by title:', error);
      return res.status(500).json({ message: 'Error fetching books by title.' });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    let reviews = books[isbn].reviews
    if (Object.keys(reviews).length > 0) {
        return res.status(200).json({reviews: reviews})
    } else { 
        return res.status(404).json({ message: "No reviews found for this book"})
        }
    } else {
        return res.status(404).json({message: "Book not found." });
    }
});

module.exports.general = public_users;
