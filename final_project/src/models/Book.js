let books = {
    1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {} },
    2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {} },
    3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": {} },
    4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": {} },
    5: {"author": "Unknown","title": "The Book Of Job", "reviews": {} },
    6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": {} },
    7: {"author": "Unknown","title": "Njál's Saga", "reviews": {} },
    8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": {} },
    9: {"author": "Honoré de Balzac","title": "Le Père Goriot", "reviews": {} },
    10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
};

class Book {
    static getAll() {
        return books;
    }
    
    static getByIsbn(isbn) {
        return books[isbn] || null;
    }
    
    static getByAuthor(author) {
        const booksByAuthor = [];
        for (let key in books) {
            if (books[key].author === author) {
                booksByAuthor.push(books[key]);
            }
        }
        return booksByAuthor;
    }
    
    static getByTitle(title) {
        const booksByTitle = [];
        for (let key in books) {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                booksByTitle.push(books[key]);
            }
        }
        return booksByTitle;
    }
    
    static addReview(isbn, username, review) {
        if (!books[isbn]) {
            return false;
        }
        books[isbn].reviews[username] = review;
        return true;
    }
    
    static deleteReview(isbn, username) {
        if (!books[isbn] || !books[isbn].reviews[username]) {
            return false;
        }
        delete books[isbn].reviews[username];
        return true;
    }
    
    static getReviews(isbn) {
        if (!books[isbn]) {
            return null;
        }
        return books[isbn].reviews;
    }
}

module.exports = Book;
