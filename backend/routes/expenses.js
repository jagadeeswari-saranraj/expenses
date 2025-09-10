const express = require('express');
const { validationResult } = require('express-validator');
const Expense = require('../models/expenses');
const { expenseValidator } = require('../validator/expenseValidator');

const router = express.Router();

// Create new expense
router.post('/', expenseValidator, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({ message: 'Expense saved successfully', data: expense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/expenses?field=total&order=asc
router.get('/', async (req, res) => {
   try {
    // Optional: allow sorting order via query ?sort=asc or ?sort=desc
    const sortField = req.query.field || 'date';
    const sortOrder = req.query.sort === 'asc' ? 1 : -1;

    const expenses = await Expense.find().sort({ [sortField]: sortOrder });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get expense by id
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);  // singular 'expense'

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    // Handle invalid ObjectId error
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update expense by ID
router.put('/:id', expenseValidator, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense updated successfully', data: updatedExpense });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete expense by ID
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully', data: expense });
  } catch (error) {
    // Handle invalid ObjectId error
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = router;
