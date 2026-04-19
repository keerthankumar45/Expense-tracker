const express = require("express");
const app = express();
const routes = require("./routes/expenseRoutes");
const mongoose = require("mongoose");

app.use(express.json());
app.use("/api", routes);

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/expenses")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

module.exports = app;