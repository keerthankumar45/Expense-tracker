const request = require("supertest");
const app = require("../app");
const Expense = require("../models/expenseModel");

describe("DELETE /api/expenses/:id", () => {

  it("should delete an existing expense", async () => {

    // ✅ Create with unique data
    const createRes = await request(app)
      .post("/api/expenses")
      .send({
        title: "Delete " + Date.now(),
        amount: 100,
        category: "Food"
      });

    const id = createRes.body._id;

    // ✅ Delete
    const res = await request(app).delete(`/api/expenses/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted successfully");
  });

  it("should return 404 for non-existing expense", async () => {
    const res = await request(app)
      .delete("/api/expenses/64b000000000000000000000");

    expect(res.statusCode).toBe(404);
  });

  it("should return 400 for invalid ID", async () => {
    const res = await request(app).delete("/api/expenses/invalid-id");

    expect(res.statusCode).toBe(400);
  });

});
afterAll(async () => {
  const mongoose = require("mongoose");
  await mongoose.connection.close();
});
