const express = require('express');
const Book = require('./models/book');
const Match = require('./models/match');
require('dotenv').config();

const app= express();
app.use(express.json());


// Endpoints
app.get('/books', async (req, res) => {
    try{
        const books = await Book.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})

// GET SPECIFIC
app.get('/books/:id', async (req, res) =>    {
    try {
        const book = await Book.getBookById(req.params.id);
        book ? res.status(200).json(book) : res.status(404).json({message : "Pas trouvé"})
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

// POST BOOK
app.post('/books', async (req, res) => {
    try {
        const newBook = await Book.createBook(req.body);
        res.status(201).json(newBook);
    } catch(error){
        res.status(500).json({error: error.message})
    }
})
// PUT BOOK
app.put('/books/:id', async (req, res) =>{
    try {
        const updatedBook = await Book.updateBook(req.params.id, req.body);
        res.status(200).json(updatedBook);
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

// PATCH BOOK
app.patch('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.updateBook(req.params.id, req.body, { partial: true });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  DELETE
app.delete('/books/:id', async (req, res) => {
    try {
        await Book.deleteBook(req.params.id);
        res.status(204).send();
    } catch(error){
        res.status(500).json({error: error.message})
    }
})



// Endpoints for matches
app.get('/matches/user/:userId', async (req, res) => {
    try {
        const matches = await Match.getRecentMatchesByUser(req.params.userId);
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/matches/:id', async (req, res) => {
    try {
        const match = await Match.getMatchById(req.params.id);
        match ? res.status(200).json(match) : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/matches', async (req, res) => {
    try {
        const newMatch = await Match.createMatch(req.body);
        res.status(201).json(newMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/matches/:id', async (req, res) => {
    try {
        const updatedMatch = await Match.updateMatch(req.params.id, req.body);
        res.status(200).json(updatedMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/matches/:id', async (req, res) => {
    try {
        const updatedMatch = await Match.updateMatch(req.params.id, req.body, { partial: true });
        res.status(200).json(updatedMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/matches/:id', async (req, res) => {
    try {
        await Match.deleteMatch(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});