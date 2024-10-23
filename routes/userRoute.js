const router = require("express").Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

router.get("/search", auth, userController.searchUser);
router.get("/user/:id", auth, userController.getUser);
router.patch("/user/:id", auth, userController.updateUser);
router.patch("/user/:id/reset_password", auth, userController.resetPassword);
router.patch("/user/:id/friend", auth, userController.friend);
router.patch("/user/:id/unfriend", auth, userController.unfriend);

module.exports = router;
