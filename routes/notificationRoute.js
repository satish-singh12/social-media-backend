const router = require("express").Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

router.post("/notification", auth, notificationController.createNotification);
router.delete(
  "/notification/:id",
  auth,
  notificationController.removeNotification
);
router.get("/notifications", auth, notificationController.getNotification);

module.exports = router;