const { body } = require('express-validator');

const expenseValidator = [
  body('user')
    .isString().withMessage('User must be a string'),
  
  body('description')
    .isString().withMessage('Description must be a string'),
  
  body('total')
    .isNumeric().withMessage('Total must be a number'),

  body('byCategory')
    .isObject().withMessage('byCategory must be an object'),

  body('byCategory.*')
    .isNumeric().withMessage('Each category value must be a number'),
  
  body('date')
    .isISO8601().withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)')
];

module.exports = { expenseValidator };