const allowedCategories = ["Food", "Travel", "Shopping", "Other"];

exports.validateExpense = (data) => {
  const { title, amount, category } = data;

  if (!title || !amount || !category) {
    return "Required fields are missing";
  }

  if (title.length < 3) {
    return "Title must be at least 3 characters";
  }

  if (amount <= 0) {
    return "Amount must be greater than zero";
  }

  if (!allowedCategories.includes(category)) {
    return "Invalid category";
  }

  return null;
};

exports.validateUpdate = (data) => {
  const { title, amount, category } = data;

  if (title && title.length < 3) {
    return "Title must be at least 3 characters";
  }

  if (amount && amount <= 0) {
    return "Amount must be greater than zero";
  }

  if (category && !allowedCategories.includes(category)) {
    return "Invalid category";
  }

  return null;
};