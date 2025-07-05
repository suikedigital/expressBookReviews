const Book = require('../models/Book');
const { sendSuccess, sendError, sendNotFound, sendValidationError } = require('../utils/responseHelpers');

/**
 * Get all books
 */
const getAllBooks = async (req, res, next) => {
    try {
        const books = Book.getAll();
        return sendSuccess(res, { books }, 'Books retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get book by ISBN
 */
const getBookByIsbn = async (req, res, next) => {
    try {
        const { isbn } = req.params;
        const book = Book.getByIsbn(isbn);
        
        if (!book) {
            return sendNotFound(res, 'Book not found');
        }
        
        return sendSuccess(res, book, 'Book retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get books by author
 */
const getBooksByAuthor = async (req, res, next) => {
    try {
        const { author } = req.params;
        const books = Book.getByAuthor(author);
        
        if (books.length === 0) {
            return sendNotFound(res, 'No books found by this author');
        }
        
        return sendSuccess(res, { books }, 'Books retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get books by title
 */
const getBooksByTitle = async (req, res, next) => {
    try {
        const { title } = req.params;
        const books = Book.getByTitle(title);
        
        if (books.length === 0) {
            return sendNotFound(res, 'No books found with this title');
        }
        
        return sendSuccess(res, { books }, 'Books retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get book reviews
 */
const getBookReviews = async (req, res, next) => {
    try {
        const { isbn } = req.params;
        const reviews = Book.getReviews(isbn);
        
        if (reviews === null) {
            return sendNotFound(res, 'Book not found');
        }
        
        if (Object.keys(reviews).length === 0) {
            return sendNotFound(res, 'No reviews found for this book');
        }
        
        return sendSuccess(res, { reviews }, 'Reviews retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Add book review (requires authentication)
 */
const addBookReview = async (req, res, next) => {
    try {
        const { isbn } = req.params;
        const { review } = req.body;
        const username = req.user.username;
        
        if (!review) {
            return sendValidationError(res, 'Review text is required');
        }
        
        const success = Book.addReview(isbn, username, review);
        
        if (!success) {
            return sendNotFound(res, 'Book not found');
        }
        
        return sendSuccess(res, null, 'Review added successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Delete book review (requires authentication)
 */
const deleteBookReview = async (req, res, next) => {
    try {
        const { isbn } = req.params;
        const username = req.user.username;
        
        const success = Book.deleteReview(isbn, username);
        
        if (!success) {
            return sendNotFound(res, 'Book not found or you have not reviewed this book');
        }
        
        return sendSuccess(res, null, 'Review deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBooks,
    getBookByIsbn,
    getBooksByAuthor,
    getBooksByTitle,
    getBookReviews,
    addBookReview,
    deleteBookReview
};
