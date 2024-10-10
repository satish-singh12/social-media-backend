const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");

// This function verifies the JWT token, finds the user, and adds the user information to the request object
const auth = async (req, res, next) => {
  try {
    // Get the Authorization header, which contains the JWT token
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied" });

    // Verify the token using the secret stored in the environment variable
    const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRET);

    if (!decoded) return res.status(401).json({ message: "Invalid Token" });

    const user = await Users.findOne({ _id: decoded.id });

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = auth;
