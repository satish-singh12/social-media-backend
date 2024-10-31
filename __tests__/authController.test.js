const request = require("supertest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { app } = require("../app");
const Users = require("../models/userModel");

describe("AuthController", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Clean up test data after each test
  afterEach(async () => {
    await Users.deleteMany();
  });

  // Disconnect from the test database after all tests are done
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("POST /api/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/register").send({
        username: "testuser",
        fullname: "Test User",
        email: "testuser@example.com",
        password: "password123",
        gender: "male",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Registered successfully!");
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body.user).toHaveProperty("username", "testuser");
      expect(res.body.user).toHaveProperty("email", "testuser@example.com");
    });

    it("should return 400 if email already exists", async () => {
      // Create an existing user
      await Users.create({
        username: "existinguser",
        fullname: "Existing User",
        email: "existing@example.com",
        password: await bcrypt.hash("password123", 10),
        gender: "female",
      });

      const res = await request(app).post("/api/register").send({
        username: "newuser",
        fullname: "New User",
        email: "existing@example.com",
        password: "password123",
        gender: "male",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "This email is already exists"
      );
    });
  });

  describe("POST /api/login", () => {
    beforeEach(async () => {
      // Register a user before testing login
      const hashedPassword = await bcrypt.hash("password123", 10);
      await Users.create({
        username: "testuser",
        fullname: "Test User",
        email: "testuser@example.com",
        password: hashedPassword,
        gender: "male",
      });
    });

    it("should login an existing user", async () => {
      const res = await request(app).post("/api/login").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Login successfully!");
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body.user).toHaveProperty("username", "testuser");
    });

    it("should return 400 if password is incorrect", async () => {
      const res = await request(app).post("/api/login").send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should return 400 if email does not exist", async () => {
      const res = await request(app).post("/api/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "User does not exists");
    });
  });
});
