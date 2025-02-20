const express = require('express');
const Book = require('../models/book');

const router = express.Router();

// GET all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a specific book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.getBookById(req.params.id);
        book ? res.status(200).json(book) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new book
router.post('/', async (req, res) => {
    try {
        const newBook = await Book.createBook(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT to update a book by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedBook = await Book.updateBook(req.params.id, req.body);
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a book by ID
router.delete('/:id', async (req, res) => {
    try {
        await Book.deleteBook(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;