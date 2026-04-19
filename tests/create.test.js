const request = require("supertest");
const app = require("../app");


describe("Create Expense API", () => {

  it("should create a valid expense", async () => {
    const res = await request(app).post("/api/expenses").send({
      title: "Lunch " + Date.now(),
      amount: 100,
      category: "Food"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/api/expenses").send({
      title: "",
      amount: 100
    });

    expect(res.statusCode).toBe(400);
  });

  it("should fail for invalid amount", async () => {
    const res = await request(app).post("/api/expenses").send({
      title: "Test " + Date.now(),
      amount: -10,
      category: "Food"
    });

    expect(res.statusCode).toBe(400);
  });

});
afterAll(async () => {
  const mongoose = require("mongoose");
  await mongoose.connection.close();
});
