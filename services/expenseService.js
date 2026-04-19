const Expense = require("../models/expenseModel");

const allowedCategories = ["Food", "Travel", "Shopping", "Other"];

// Daily limit (with date support)
exports.checkDailyLimit = async (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const count = await Expense.countDocuments({
    date: { $gte: start, $lte: end }
  });

  return count >= 10;
};

// Duplicate check (fixed with date range)
exports.checkDuplicate = async (title, amount, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return await Expense.findOne({
    title,
    amount,
    date: { $gte: start, $lte: end }
  });
};

// MAIN FIX: Filtering + Negative Scenarios
exports.getFilteredExpenses = async (query) => {
  let { category, startDate, endDate, page = 1, limit = 5 } = query;

  // Convert pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0) {
    throw new Error("Invalid pagination values");
  }

  // Category validation
  if (category && !allowedCategories.includes(category)) {
    throw new Error("Invalid category filter");
  }

  // Date validation
  if (startDate && isNaN(new Date(startDate))) {
    throw new Error("Invalid start date");
  }

  if (endDate && isNaN(new Date(endDate))) {
    throw new Error("Invalid end date");
  }

  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  return await Expense.find(filter)
    .sort({ date: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);
};

// Total calculation
exports.getTotal = async () => {
  const result = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  return result.length ? result[0].total : 0;
};