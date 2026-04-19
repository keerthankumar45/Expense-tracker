const mongoose = require("mongoose");
const app = require("./app");

const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/expenseDB")
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => console.log("DB connection failed"));