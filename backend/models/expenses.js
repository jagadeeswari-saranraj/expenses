const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: String, required: true },
  description: { type: String, required: true },
  total: { type: Number, required: true },
  byCategory: { type: Map, of: Number, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Expense', expenseSchema);
