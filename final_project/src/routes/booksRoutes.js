const express = require('express');
const {
    getAllBooks,
    getBookByIsbn,
    getBooksByAuthor,
    getBooksByTitle,
    getBookReviews,
    addBookReview,
    deleteBookReview
} = require('../controllers/booksController');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateReview } = require('../middleware/validation');
const { bookOperationsRateLimit } = require('../middleware/security');

const router = express.Router();

// Apply rate limiting to all book routes
router.use(bookOperationsRateLimit);

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Books]
 *     summary: Get all books
 *     description: Retrieve a list of all available books
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Books retrieved successfully"
 *               data:
 *                 books:
 *                   "1": 
 *                     isbn: "9781234567890"
 *                     title: "The Great Gatsby"
 *                     author: "F. Scott Fitzgerald"
 *                     reviews: {}
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', asyncHandler(getAllBooks));

/**
 * @swagger
 * /isbn/{isbn}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by ISBN
 *     description: Retrieve a specific book by its ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISBN of the book
 *         example: "9781234567890"
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Book found"
 *               data:
 *                 book:
 *                   isbn: "9781234567890"
 *                   title: "The Great Gatsby"
 *                   author: "F. Scott Fitzgerald"
 *                   reviews: {}
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/isbn/:isbn', asyncHandler(getBookByIsbn));

/**
 * @swagger
 * /author/{author}:
 *   get:
 *     tags: [Books]
 *     summary: Get books by author
 *     description: Retrieve books by a specific author
 *     parameters:
 *       - in: path
 *         name: author
 *         required: true
 *         schema:
 *           type: string
 *         description: The author name
 *         example: "F. Scott Fitzgerald"
 *     responses:
 *       200:
 *         description: Books by author found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Books by author found"
 *               data:
 *                 books: []
 *       404:
 *         description: No books found by this author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/author/:author', asyncHandler(getBooksByAuthor));

/**
 * @swagger
 * /title/{title}:
 *   get:
 *     tags: [Books]
 *     summary: Get books by title
 *     description: Retrieve books matching a specific title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The book title
 *         example: "The Great Gatsby"
 *     responses:
 *       200:
 *         description: Books with matching title found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: No books found with this title
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/title/:title', asyncHandler(getBooksByTitle));

/**
 * @swagger
 * /review/{isbn}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get book reviews
 *     description: Retrieve all reviews for a specific book
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISBN of the book
 *         example: "9781234567890"
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Reviews retrieved successfully"
 *               data:
 *                 reviews:
 *                   "user1": 
 *                     review: "Great book!"
 *                     rating: 5
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/review/:isbn', asyncHandler(getBookReviews));

/**
 * @swagger
 * /auth/review/{isbn}:
 *   put:
 *     tags: [Reviews]
 *     summary: Add or update a book review
 *     description: Add a new review or update an existing review for a book (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISBN of the book
 *         example: "9781234567890"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *           example:
 *             review: "This book is amazing!"
 *             rating: 5
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/auth/review/:isbn', 
    authenticateToken, 
    validateReview,
    asyncHandler(addBookReview)
);

/**
 * @swagger
 * /auth/review/{isbn}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a book review
 *     description: Delete user's review for a specific book (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISBN of the book
 *         example: "9781234567890"
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Book or review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/auth/review/:isbn', 
    authenticateToken, 
    asyncHandler(deleteBookReview)
);

module.exports = router;
