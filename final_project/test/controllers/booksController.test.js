const booksController = require('../../src/controllers/booksController');
const { sendSuccess, sendError, sendNotFound, sendValidationError } = require('../../src/utils/responseHelpers');

// Mock dependencies
jest.mock('../../src/models/Book');
jest.mock('../../src/utils/responseHelpers');

const Book = require('../../src/models/Book');

describe('Books Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: { username: 'testuser' }
    };
    mockRes = {};
    mockNext = jest.fn();
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('should return all books successfully', async () => {
      const mockBooks = {
        '1': { title: 'Book 1', author: 'Author 1', reviews: {} },
        '2': { title: 'Book 2', author: 'Author 2', reviews: {} }
      };
      
      Book.getAll.mockReturnValue(mockBooks);

      await booksController.getAllBooks(mockReq, mockRes, mockNext);

      expect(Book.getAll).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, { books: mockBooks }, 'Books retrieved successfully');
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      Book.getAll.mockImplementation(() => {
        throw error;
      });

      await booksController.getAllBooks(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBookByIsbn', () => {
    it('should return book for valid ISBN', async () => {
      mockReq.params.isbn = '1';
      const mockBook = { title: 'Test Book', author: 'Test Author', reviews: {} };
      
      Book.getByIsbn.mockReturnValue(mockBook);

      await booksController.getBookByIsbn(mockReq, mockRes, mockNext);

      expect(Book.getByIsbn).toHaveBeenCalledWith('1');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, mockBook, 'Book retrieved successfully');
    });

    it('should return 404 for non-existent book', async () => {
      mockReq.params.isbn = '999';
      
      Book.getByIsbn.mockReturnValue(null);

      await booksController.getBookByIsbn(mockReq, mockRes, mockNext);

      expect(Book.getByIsbn).toHaveBeenCalledWith('999');
      expect(sendNotFound).toHaveBeenCalledWith(mockRes, 'Book not found');
    });

    it('should handle errors gracefully', async () => {
      mockReq.params.isbn = '1';
      const error = new Error('Database error');
      
      Book.getByIsbn.mockImplementation(() => {
        throw error;
      });

      await booksController.getBookByIsbn(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBooksByAuthor', () => {
    it('should return books by existing author', async () => {
      mockReq.params.author = 'Test Author';
      const mockBooks = [
        { title: 'Book 1', author: 'Test Author', reviews: {} },
        { title: 'Book 2', author: 'Test Author', reviews: {} }
      ];
      
      Book.getByAuthor.mockReturnValue(mockBooks);

      await booksController.getBooksByAuthor(mockReq, mockRes, mockNext);

      expect(Book.getByAuthor).toHaveBeenCalledWith('Test Author');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, { books: mockBooks }, 'Books retrieved successfully');
    });

    it('should return 404 for author with no books', async () => {
      mockReq.params.author = 'Unknown Author';
      
      Book.getByAuthor.mockReturnValue([]);

      await booksController.getBooksByAuthor(mockReq, mockRes, mockNext);

      expect(sendNotFound).toHaveBeenCalledWith(mockRes, 'No books found by this author');
    });

    it('should handle errors gracefully', async () => {
      mockReq.params.author = 'Test Author';
      const error = new Error('Database error');
      
      Book.getByAuthor.mockImplementation(() => {
        throw error;
      });

      await booksController.getBooksByAuthor(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBooksByTitle', () => {
    it('should return books by existing title', async () => {
      mockReq.params.title = 'Test Book';
      const mockBooks = [
        { title: 'Test Book', author: 'Author 1', reviews: {} }
      ];
      
      Book.getByTitle.mockReturnValue(mockBooks);

      await booksController.getBooksByTitle(mockReq, mockRes, mockNext);

      expect(Book.getByTitle).toHaveBeenCalledWith('Test Book');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, { books: mockBooks }, 'Books retrieved successfully');
    });

    it('should return 404 for non-existent title', async () => {
      mockReq.params.title = 'Unknown Book';
      
      Book.getByTitle.mockReturnValue([]);

      await booksController.getBooksByTitle(mockReq, mockRes, mockNext);

      expect(sendNotFound).toHaveBeenCalledWith(mockRes, 'No books found with this title');
    });

    it('should handle errors gracefully', async () => {
      mockReq.params.title = 'Test Book';
      const error = new Error('Database error');
      
      Book.getByTitle.mockImplementation(() => {
        throw error;
      });

      await booksController.getBooksByTitle(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBookReviews', () => {
    it('should return reviews for book with reviews', async () => {
      mockReq.params.isbn = '1';
      const mockReviews = {
        'user1': 'Great book!',
        'user2': 'Excellent read!'
      };
      
      Book.getReviews.mockReturnValue(mockReviews);

      await booksController.getBookReviews(mockReq, mockRes, mockNext);

      expect(Book.getReviews).toHaveBeenCalledWith('1');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, { reviews: mockReviews }, 'Reviews retrieved successfully');
    });

    it('should return 404 for non-existent book', async () => {
      mockReq.params.isbn = '999';
      
      Book.getReviews.mockReturnValue(null);

      await booksController.getBookReviews(mockReq, mockRes, mockNext);

      expect(sendNotFound).toHaveBeenCalledWith(mockRes, 'Book not found');
    });

    it('should return 404 for book with no reviews', async () => {
      mockReq.params.isbn = '1';
      
      Book.getReviews.mockReturnValue({});

      await booksController.getBookReviews(mockReq, mockRes, mockNext);

      expect(sendNotFound).toHaveBeenCalledWith(mockRes, 'No reviews found for this book');
    });

    it('should handle errors gracefully', async () => {
      mockReq.params.isbn = '1';
      const error = new Error('Database error');
      
      Book.getReviews.mockImplementation(() => {
        throw error;
      });

      await booksController.getBookReviews(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addBookReview', () => {
    beforeEach(() => {
      mockReq.params.isbn = '1';
      mockReq.body.review = 'Great book!';
      mockReq.user = { username: 'testuser' };
    });

    it('should add review successfully', async () => {
      Book.addReview.mockReturnValue(true);

      await booksController.addBookReview(mockReq, mockRes, mockNext);

      expect(Book.addReview).toHaveBeenCalledWith('1', 'testuser', 'Great book!');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, null, 'Review added successfully');
    });

    it('should return validation error for missing review', async () => {
      mockReq.body.review = '';

      await booksController.addBookReview(mockReq, mockRes, mockNext);

      expect(sendValidationError).toHaveBeenCalledWith(mockRes, 'Review text is required');
      expect(Book.addReview).not.toHaveBeenCalled();
    });

    it('should return validation error for undefined review', async () => {
      delete mockReq.body.review;

      await booksController.addBookReview(mockReq, mockRes, mockNext);

      expect(sendValidationError).toHaveBeenCalledWith(mockRes, 'Review text is required');
      expect(Book.addReview).not.toHaveBeenCalled();
    });

    it('should return 404 for non-existent book', async () => {
      Book.addReview.mockReturnValue(false);

      await booksController.addBookReview(mockReq, mockRes, mockNext);

      expect(sendNotFound).toHaveBeenCalledWith(mockRes, 'Book not found');
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      Book.addReview.mockImplementation(() => {
        throw error;
      });

      await booksController.addBookReview(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteBookReview', () => {
    beforeEach(() => {
      mockReq.params.isbn = '1';
      mockReq.user = { username: 'testuser' };
    });

    it('should delete review successfully', async () => {
      Book.deleteReview.mockReturnValue(true);

      await booksController.deleteBookReview(mockReq, mockRes, mockNext);

      expect(Book.deleteReview).toHaveBeenCalledWith('1', 'testuser');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, null, 'Review deleted successfully');
    });

    it('should return 404 for non-existent book or review', async () => {
      Book.deleteReview.mockReturnValue(false);

      await booksController.deleteBookReview(mockReq, mockRes, mockNext);

      expect(sendNotFound).toHaveBeenCalledWith(mockRes, 'Book not found or you have not reviewed this book');
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      Book.deleteReview.mockImplementation(() => {
        throw error;
      });

      await booksController.deleteBookReview(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
