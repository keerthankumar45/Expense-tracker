const express = require("express");
const router = express.Router();
const controller = require("../controllers/expenseController");

router.post("/expenses", controller.createExpense);
router.get("/expenses", controller.getExpenses);
router.get("/expenses/total", controller.getTotalExpenses);
router.get("/expenses/:id", controller.getExpenseById);
router.put("/expenses/:id", controller.updateExpense);
router.delete("/expenses/:id", controller.deleteExpense);

module.exports = router;