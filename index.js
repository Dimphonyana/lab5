const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let books = [];
let bookIdCounter = 1;
let bookdetailsCounter = 1;

app.get('/whoami', (req, res) => {
    res.json({ studentNumber: "2538570" });
});

// Get the list of books
app.get('/books', (req, res) => {
    res.json(books);
});

// Get a book by its ID
app.get('/books/:id', (req, res) => {
    const book = books.find(c => c.id === req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
});

// Add a new book
app.post('/books', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    const newBook = { id: String(bookIdCounter++), title, details: [] };
    books.push(newBook);
    res.status(201).json(newBook);
});

// Update a book
app.put('/books/:id', (req, res) => {
    const book = books.find(c => c.id === req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const { title } = req.body;
    if (title) book.title = title;
    res.json(book);
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    books = books.filter(c => c.id !== req.params.id);
    res.status(204).send();
});

// Add details to a book
app.post('/books/:id/details', (req, res) => {
    const book = books.find(c => c.id === req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const { author, genre, publicationYear } = req.body;
    if (!author || !genre || !publicationYear) {
        return res.status(400).json({ error: "Missing author, genre, or publication year" });
    }
    const newDetails = { id: String(bookdetailsCounter++), author, genre, publicationYear };
    book.details.push(newDetails);
    res.json(book);
});

// Delete details from a book
app.delete('/books/:id/details/:detailId', (req, res) => {
    const book = books.find(c => c.id === req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    
    book.details = book.details.filter(a => a.id !== req.params.detailId);
    res.json(book);
});

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
