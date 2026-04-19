# Expense Tracker API

## Overview

This project is a backend service built for managing daily expenses.
It provides a set of REST APIs to perform basic operations like creating, updating, deleting, and retrieving expenses.

The implementation focuses on handling real-world scenarios such as input validation, duplicate entries, and daily limits, as specified in the assignment.
## Tech Stack

* Node.js
* Express.js
* MongoDB with Mongoose
* Jest & Supertest (for testing)

## Project Structure
expense tracker
├─ app.js
├─ controllers
│  └─ expenseController.js
├─ models
│  └─ expenseModel.js
├─ routes
│  └─ expenseRoutes.js
├─ services
│  └─ expenseService.js
├─ utils
│  └─ validators.js
├─ tests
│  ├─ create.test.js
│  ├─ get.test.js
│  ├─ update.test.js
│  ├─ delete.test.js
│  └─ expenseFeatures.test.js
├─ server.js
└─ README.md
## Setup Instructions

1. Clone the repository


git clone <your-repo-link>


2. Install dependencies


npm install


3. Start the server


npm start


4. Run tests


npm test

## API Endpoints

### Create Expense

POST `/api/expenses`

Example request:

{
  "title": "Lunch",
  "amount": 100,
  "category": "Food"
}

### Get All Expenses

GET `/api/expenses`

Supports:

* category filter
* date range (startDate, endDate)
* pagination (page, limit)

### Get Expense by ID

GET `/api/expenses/:id`

### Update Expense

PUT `/api/expenses/:id`

### Delete Expense

DELETE `/api/expenses/:id`

### Get Total Expenses

GET `/api/expenses/total`

## Business Rules Implemented

* Title must be at least 3 characters long
* Amount must be greater than zero
* Category must be one of: Food, Travel, Shopping, Other
* Maximum 10 expenses can be added per day
* Duplicate expenses (same title, amount, and date) are not allowed

## Error Handling

The APIs return structured error responses. Example:

{
  "error": "Bad Request",
  "message": "Invalid category"
}


Appropriate HTTP status codes are used:

* 201 → Created
* 200 → Success
* 400 → Bad Request
* 404 → Not Found
* 500 → Server Error

## Testing

Test cases are written using Jest and Supertest.

They cover:

* All CRUD operations
* Validation scenarios
* Edge cases such as invalid IDs, duplicate entries, and daily limits
* Filtering, pagination, and total calculation

Run tests using:

npm test




## Notes

This implementation follows a layered structure with controllers, services, and utilities to keep the code organized and readable.

The focus was on meeting the assignment requirements with proper validation, error handling, and test coverage.
