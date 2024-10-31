require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const authController = {
  register: async (req, res) => {
    try {
      const { username, fullname, email, password, gender } = req.body;
      const newUsername = username.toLowerCase().replace(/ /g, "");

      const User = await Users.findOne({ username: newUsername });
      if (User)
        return res
          .status(400)
          .json({ message: "This username is already exists" });

      const Email = await Users.findOne({ email: email });
      if (Email)
        return res
          .status(400)
          .json({ message: "This email is already exists" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ message: "Password must me atleaset 6 characters" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new Users({
        username: newUsername,
        fullname,
        email,
        password: hashedPassword,
        gender,
      });

      const accessToken = createAccessToken({ id: newUser.id });
      const refreshToken = createRefreshToken({ id: newUser.id });

      await newUser.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 24 * 30 * 60 * 60 * 1000, // Cookie lifespan in milliseconds
      });

      res.status(201).json({
        message: "Registered successfully!",
        accessToken,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const User = await Users.findOne({ email }).populate(
        "friends following",
        "-password"
      );
      if (!User)
        return res.status(400).json({ message: "User does not exists" });

      const isMatched = await bcrypt.compare(password, User.password);
      if (!isMatched)
        return res.status(400).json({ message: "Invalid credentials" });

      const accessToken = createAccessToken({ id: User._id });
      const refreshToken = createRefreshToken({ id: User._id });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 24 * 30 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });

      res.status(201).json({
        message: "Login successfully!",
        accessToken,
        user: {
          ...User._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "api/refresh_token" });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  generateJwtToken: async (req, res) => {
    try {
      const refresh_token = req.cookies.refreshToken;
      if (!refresh_token)
        return res.status(400).json({ message: "Please login now.." });

      jwt.verify(
        refresh_token,
        process.env.REFRESHTOKENSECRET,
        async (err, result) => {
          if (err)
            return res.status(400).json({ message: "Please login now.." });

          const User = await Users.findById(result.id)
            .select("-password")
            .populate("friends following");

          if (!User)
            return res.status(400).json({ message: "User does not exists" });

          const accessToken = createAccessToken({ id: result.id });
          res.json({
            accessToken,
            User,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESSTOKENSECRET, { expiresIn: "1d" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESHTOKENSECRET, { expiresIn: "7d" });
};
module.exports = authController;
