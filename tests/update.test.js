const request = require("supertest");
const app = require("../app");
const Expense = require("../models/expenseModel");

describe("Update Expense API", () => {

  let expenseId;

  beforeAll(async () => {
    const res = await request(app).post("/api/expenses").send({
      title: "Dinner " + Date.now(),
      amount: 200,
      category: "Food"
    });

    expenseId = res.body._id;
  });

  it("should update an expense", async () => {
    const res = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .send({ title: "Updated " + Date.now() });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toContain("Updated");
  });

  it("should fail for invalid update data", async () => {
    const res = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .send({ amount: -50 });

    expect(res.statusCode).toBe(400);
  });

});
afterAll(async () => {
  const mongoose = require("mongoose");
  await mongoose.connection.close();
});
