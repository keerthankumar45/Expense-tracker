const request = require("supertest");
const app = require("../app");

describe("Additional Expense API Tests", () => {

  it("should return total expenses", async () => {
    const res = await request(app).get("/api/expenses/total");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("total");
  });

  it("should filter expenses by category", async () => {
    // create sample
    await request(app).post("/api/expenses").send({
      title: "FilterTest " + Date.now(),
      amount: 100,
      category: "Food"
    });

    const res = await request(app).get("/api/expenses?category=Food");

    expect(res.statusCode).toBe(200);
  });

  it("should support pagination", async () => {
    const res = await request(app).get("/api/expenses?page=1&limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  it("should prevent duplicate expense", async () => {
    const data = {
      title: "DuplicateTest",
      amount: 200,
      category: "Food"
    };

    await request(app).post("/api/expenses").send(data);
    const res = await request(app).post("/api/expenses").send(data);

    expect(res.statusCode).toBe(400);
  });

  it("should enforce daily limit of 10 expenses", async () => {

    for (let i = 0; i < 10; i++) {
      await request(app).post("/api/expenses").send({
        title: "LimitTest " + i + Date.now(),
        amount: 50,
        category: "Food"
      });
    }

    const res = await request(app).post("/api/expenses").send({
      title: "Limit Exceed",
      amount: 50,
      category: "Food"
    });

    expect(res.statusCode).toBe(400);
  });

});

afterAll(async () => {
  const mongoose = require("mongoose");
  await mongoose.connection.close();
});