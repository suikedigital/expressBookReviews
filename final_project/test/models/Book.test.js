// Reset the module cache and reimport Book for each test
let Book;

describe('Book Model', () => {
  beforeEach(() => {
    // Clear the module cache
    delete require.cache[require.resolve('../../src/models/Book')];
    // Import fresh Book model
    Book = require('../../src/models/Book');
    
    // Reset all book reviews to empty state
    const books = Book.getAll();
    Object.keys(books).forEach(isbn => {
      books[isbn].reviews = {};
    });
  });

  describe('getAll', () => {
    it('should return all books', () => {
      const books = Book.getAll();
      
      expect(typeof books).toBe('object');
      expect(Object.keys(books).length).toBeGreaterThan(0);
      
      // Verify structure of first book
      const firstBook = books['1'];
      expect(firstBook).toHaveProperty('author');
      expect(firstBook).toHaveProperty('title');
      expect(firstBook).toHaveProperty('reviews');
    });

    it('should include expected books', () => {
      const books = Book.getAll();
      
      expect(books['1']).toEqual({
        author: 'Chinua Achebe',
        title: 'Things Fall Apart',
        reviews: {}
      });
      
      expect(books['8']).toEqual({
        author: 'Jane Austen',
        title: 'Pride and Prejudice',
        reviews: {}
      });
    });
  });

  describe('getByIsbn', () => {
    it('should return book for valid ISBN', () => {
      const book = Book.getByIsbn('1');
      
      expect(book).toBeTruthy();
      expect(book.author).toBe('Chinua Achebe');
      expect(book.title).toBe('Things Fall Apart');
      expect(book.reviews).toEqual({});
    });

    it('should return null for invalid ISBN', () => {
      const book = Book.getByIsbn('999');
      expect(book).toBeNull();
    });

    it('should return null for non-string ISBN', () => {
      const book = Book.getByIsbn(null);
      expect(book).toBeNull();
    });
  });

  describe('getByAuthor', () => {
    it('should return books by existing author', () => {
      const books = Book.getByAuthor('Unknown');
      
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
      
      books.forEach(book => {
        expect(book.author).toBe('Unknown');
      });
    });

    it('should return books by specific author', () => {
      const books = Book.getByAuthor('Jane Austen');
      
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Pride and Prejudice');
    });

    it('should return empty array for non-existent author', () => {
      const books = Book.getByAuthor('Non Existent Author');
      
      expect(Array.isArray(books)).toBe(true);
      expect(books).toHaveLength(0);
    });

    it('should be case sensitive', () => {
      const booksLower = Book.getByAuthor('jane austen');
      const booksUpper = Book.getByAuthor('JANE AUSTEN');
      
      expect(booksLower).toHaveLength(0);
      expect(booksUpper).toHaveLength(0);
    });
  });

  describe('getByTitle', () => {
    it('should return books by existing title (case insensitive)', () => {
      const books = Book.getByTitle('Pride and Prejudice');
      
      expect(books).toHaveLength(1);
      expect(books[0].author).toBe('Jane Austen');
    });

    it('should be case insensitive', () => {
      const booksLower = Book.getByTitle('pride and prejudice');
      const booksUpper = Book.getByTitle('PRIDE AND PREJUDICE');
      const booksMixed = Book.getByTitle('Pride And Prejudice');
      
      expect(booksLower).toHaveLength(1);
      expect(booksUpper).toHaveLength(1);
      expect(booksMixed).toHaveLength(1);
    });

    it('should return empty array for non-existent title', () => {
      const books = Book.getByTitle('Non Existent Book');
      
      expect(Array.isArray(books)).toBe(true);
      expect(books).toHaveLength(0);
    });

    it('should handle partial matches correctly (no partial matching)', () => {
      const books = Book.getByTitle('Pride');
      expect(books).toHaveLength(0);
    });
  });

  describe('addReview', () => {
    it('should add review for valid book', () => {
      const result = Book.addReview('1', 'testuser', 'Great book!');
      
      expect(result).toBe(true);
      
      const book = Book.getByIsbn('1');
      expect(book.reviews['testuser']).toBe('Great book!');
    });

    it('should return false for invalid book ISBN', () => {
      const result = Book.addReview('999', 'testuser', 'Review text');
      
      expect(result).toBe(false);
    });

    it('should overwrite existing review from same user', () => {
      Book.addReview('1', 'testuser', 'First review');
      Book.addReview('1', 'testuser', 'Updated review');
      
      const book = Book.getByIsbn('1');
      expect(book.reviews['testuser']).toBe('Updated review');
      expect(Object.keys(book.reviews)).toHaveLength(1);
    });

    it('should allow multiple users to review same book', () => {
      Book.addReview('1', 'user1', 'Review by user1');
      Book.addReview('1', 'user2', 'Review by user2');
      
      const book = Book.getByIsbn('1');
      expect(book.reviews['user1']).toBe('Review by user1');
      expect(book.reviews['user2']).toBe('Review by user2');
      expect(Object.keys(book.reviews)).toHaveLength(2);
    });
  });

  describe('deleteReview', () => {
    beforeEach(() => {
      // Add some test reviews
      Book.addReview('1', 'user1', 'Review by user1');
      Book.addReview('1', 'user2', 'Review by user2');
    });

    it('should delete existing review', () => {
      const result = Book.deleteReview('1', 'user1');
      
      expect(result).toBe(true);
      
      const book = Book.getByIsbn('1');
      expect(book.reviews['user1']).toBeUndefined();
      expect(book.reviews['user2']).toBe('Review by user2');
    });

    it('should return false for non-existent book', () => {
      const result = Book.deleteReview('999', 'user1');
      
      expect(result).toBe(false);
    });

    it('should return false for non-existent review', () => {
      const result = Book.deleteReview('1', 'nonexistentuser');
      
      expect(result).toBe(false);
    });

    it('should return false if user has not reviewed the book', () => {
      const result = Book.deleteReview('2', 'user1'); // user1 only reviewed book 1
      
      expect(result).toBe(false);
    });
  });

  describe('getReviews', () => {
    beforeEach(() => {
      // Add some test reviews
      Book.addReview('1', 'user1', 'Excellent book!');
      Book.addReview('1', 'user2', 'Good read');
    });

    it('should return reviews for book with reviews', () => {
      const reviews = Book.getReviews('1');
      
      expect(reviews).toEqual({
        'user1': 'Excellent book!',
        'user2': 'Good read'
      });
    });

    it('should return empty object for book with no reviews', () => {
      const reviews = Book.getReviews('2');
      
      expect(reviews).toEqual({});
    });

    it('should return null for non-existent book', () => {
      const reviews = Book.getReviews('999');
      
      expect(reviews).toBeNull();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete review lifecycle', () => {
      const isbn = '3';
      const username = 'testuser';
      const initialReview = 'Initial review';
      const updatedReview = 'Updated review';
      
      // Initially no reviews
      expect(Book.getReviews(isbn)).toEqual({});
      
      // Add review
      expect(Book.addReview(isbn, username, initialReview)).toBe(true);
      expect(Book.getReviews(isbn)).toEqual({ [username]: initialReview });
      
      // Update review
      expect(Book.addReview(isbn, username, updatedReview)).toBe(true);
      expect(Book.getReviews(isbn)).toEqual({ [username]: updatedReview });
      
      // Delete review
      expect(Book.deleteReview(isbn, username)).toBe(true);
      expect(Book.getReviews(isbn)).toEqual({});
    });

    it('should maintain data integrity across multiple operations', () => {
      // Add reviews for multiple books and users
      Book.addReview('1', 'alice', 'Alice review for book 1');
      Book.addReview('1', 'bob', 'Bob review for book 1');
      Book.addReview('2', 'alice', 'Alice review for book 2');
      
      // Verify reviews are separate
      expect(Book.getReviews('1')).toEqual({
        'alice': 'Alice review for book 1',
        'bob': 'Bob review for book 1'
      });
      expect(Book.getReviews('2')).toEqual({
        'alice': 'Alice review for book 2'
      });
      
      // Delete one review, others should remain
      Book.deleteReview('1', 'alice');
      expect(Book.getReviews('1')).toEqual({
        'bob': 'Bob review for book 1'
      });
      expect(Book.getReviews('2')).toEqual({
        'alice': 'Alice review for book 2'
      });
    });
  });
});
