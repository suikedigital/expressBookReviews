const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
  
    // check if username and password are provided.
    if (!username || !password) {
      return res.status(400).json({ message: "Both username and password are required." });
    } 
    if (users[username]) {
      return res.status(400).json({ message: "Username already exists." });
    }
  
    // Correctly store the password in the users object
    users[username] = { password: password };  // or simply `users[username] = { password };`
  
    return res.status(201).json({ message: "User registered successfully!" });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({ books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn])
  } else {
        return res.status(404).json({message: "Book not found"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let booksByAuthor = [];

for (let key in books) {
    if (books[key].author === author) {
        booksByAuthor.push(books[key]);
    }
}
if (booksByAuthor.length > 0 ) {
    return res.status(200).json({ books: booksByAuthor});
} else {
    return res.status(404).json({ message: "Author not found"});
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let booksByTitle = [];

  for (let key in books) { 
    if (books[key].title === title) {
        booksByTitle.push(books[key]);
    }
  } if (booksByTitle.length > 0 ) {
    return res.status(200).json({ books: booksByTitle});
  } else {
    return res.status(404).json({ message: "Title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    let reviews = books[isbn].reviews
    if (reviews.length > 0) {
        return res.status(200).json({reviews: reviews})
    } else { 
        return res.status(404).json({ message: "No reviews found for this book"})
        }
    } else {
        return res.status(404).json({message: "Book noit found." });
    }
});

module.exports.general = public_users;
