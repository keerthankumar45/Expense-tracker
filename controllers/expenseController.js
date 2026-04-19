const Expense = require("../models/expenseModel");
const { validateExpense, validateUpdate } = require("../utils/validators");
const service = require("../services/expenseService");
const mongoose = require("mongoose");

// Helper for structured error responses
const sendError = (res, status, error, message) => {
  return res.status(status).json({ error, message });
};

exports.createExpense = async (req, res) => {
  try {
    const errorMsg = validateExpense(req.body);
    if (errorMsg) {
      return sendError(res, 400, "Bad Request", errorMsg);
    }

    const { title, amount, category, date } = req.body;

    const limitReached = await service.checkDailyLimit(date || new Date());
    if (limitReached) {
      return sendError(res, 400, "Bad Request", "Daily limit reached");
    }

    const duplicate = await service.checkDuplicate(
      title,
      amount,
      date || new Date()
    );
    if (duplicate) {
      return sendError(res, 400, "Bad Request", "Duplicate expense");
    }

    const expense = new Expense({
      title,
      amount,
      category,
      date: date || new Date(),
    });

    const saved = await expense.save();
    res.status(201).json(saved);

  } catch (err) {
    return sendError(res, 500, "Internal Server Error", "Server error");
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await service.getFilteredExpenses(req.query);

    if (expenses.length === 0) {
      return res.status(200).json({
        message: "No expenses found",
        data: []
      });
    }

    res.status(200).json({
      count: expenses.length,
      data: expenses
    });

  } catch (err) {

    const badRequestErrors = [
      "Invalid pagination values",
      "Invalid category filter",
      "Invalid start date",
      "Invalid end date"
    ];

    if (badRequestErrors.includes(err.message)) {
      return sendError(res, 400, "Bad Request", err.message);
    }

    return sendError(res, 500, "Internal Server Error", "Server error");
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Bad Request", "Invalid expense ID format");
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return sendError(res, 404, "Not Found", "Expense not found");
    }

    res.status(200).json(expense);

  } catch (err) {
    return sendError(res, 500, "Internal Server Error", "Server error");
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Bad Request", "Invalid expense ID format");
    }

    const errorMsg = validateUpdate(req.body);
    if (errorMsg) {
      return sendError(res, 400, "Bad Request", errorMsg);
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return sendError(res, 404, "Not Found", "Expense not found");
    }

    const updatedData = {
      title: req.body.title || expense.title,
      amount: req.body.amount || expense.amount,
      category: req.body.category || expense.category,
      date: req.body.date ? new Date(req.body.date) : expense.date
    };

    // Daily limit check (for updated date)
    if (req.body.date) {
      const limitReached = await service.checkDailyLimit(updatedData.date);
      if (limitReached) {
        return sendError(res, 400, "Bad Request", "Daily limit reached");
      }
    }

    // Duplicate check (excluding current record)
    const duplicate = await service.checkDuplicate(
      updatedData.title,
      updatedData.amount,
      updatedData.date
    );

    if (duplicate && duplicate._id.toString() !== id) {
      return sendError(res, 400, "Bad Request", "Duplicate expense");
    }

    Object.assign(expense, updatedData);

    const updated = await expense.save();
    res.status(200).json(updated);

  } catch (err) {
    return sendError(res, 500, "Internal Server Error", "Server error");
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Bad Request", "Invalid expense ID format");
    }

    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return sendError(res, 404, "Not Found", "Expense not found");
    }

    res.status(200).json({ message: "Deleted successfully" });

  } catch (err) {
    return sendError(res, 500, "Internal Server Error", "Server error");
  }
};

exports.getTotalExpenses = async (req, res) => {
  try {
    const total = await service.getTotal();
    res.status(200).json({ total });

  } catch (err) {
    return sendError(res, 500, "Internal Server Error", "Server error");
  }
};