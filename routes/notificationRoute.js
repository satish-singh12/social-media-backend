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
router.delete(
  "/deleteallnotification",
  auth,
  notificationController.deleteAllNotification
);
router.patch(
  "/isreadnotification/:id",
  auth,
  notificationController.isReadNotification
);

module.exports = router;
