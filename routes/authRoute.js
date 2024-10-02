const router = require("express").Router();
const authController = require("../controllers/authController");

router.get("/home", (req, res) => {
  res.json({ message: "Connected to home" });
});
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh_token", authController.generateJwtToken);

module.exports = router;
