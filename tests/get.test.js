const request = require("supertest");
const app = require("../app");
const Expense = require("../models/expenseModel");
describe("Get Expenses API", () => {

  it("should fetch all expenses", async () => {
    const res = await request(app).get("/api/expenses");

    expect(res.statusCode).toBe(200);
  });

  it("should handle empty data", async () => {
    const res = await request(app).get("/api/expenses");

    expect(res.body).toHaveProperty("data");
  });

  it("should return 400 for invalid ID", async () => {
    const res = await request(app).get("/api/expenses/invalid-id");

    expect(res.statusCode).toBe(400);
  });

});
afterAll(async () => {
  const mongoose = require("mongoose");
  await mongoose.connection.close();
});
