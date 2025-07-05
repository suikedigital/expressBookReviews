const express = require('express');
const authRoutes = require('./authRoutes');
const booksRoutes = require('./booksRoutes');

const router = express.Router();

// Mount route modules
router.use('/customer', authRoutes);
router.use('/', booksRoutes);

module.exports = router;
