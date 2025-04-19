// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit if connection fails
    });

// Define Expense schema and model
const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const Expense = mongoose.model('Expense', expenseSchema);

// GET: Root endpoint to avoid 404 errors
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Expense Tracker API', endpoints: ['/expenses', '/expenses/:id', '/expenses/category/:category'] });
});

// GET: Retrieve all expenses
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET: Retrieve expenses by category
app.get('/expenses/category/:category', async (req, res) => {
    try {
        const expenses = await Expense.find({ category: req.params.category });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST: Create a new expense
app.post('/expenses', async (req, res) => {
    try {
        const expense = new Expense({
            description: req.body.description,
            amount: req.body.amount,
            category: req.body.category
        });
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

// PUT: Update an expense by ID
app.put('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            {
                description: req.body.description,
                amount: req.body.amount,
                category: req.body.category
            },
            { new: true }
        );
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json(expense);
    } catch (err) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

// DELETE: Remove an expense by ID
app.delete('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));