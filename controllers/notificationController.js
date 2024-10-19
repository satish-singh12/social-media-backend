const Notifications = require("../models/notificationModel");

const notificationController = {
  createNotification: async (req, res) => {
    try {
      const { id, recipients, url, content, image, text, isRead } = req.body;
      const notification = await new Notifications({
        id,
        recipients,
        url,
        content,
        image,
        text,
        isRead,
        user: req.user,
      });
      await notification.save();
      return res.json({ notification });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
  removeNotification: async (req, res) => {
    try {
      const notification = await Notifications.findOneAndDelete({
        id: req.params.id,
        url: req.query.url,
      });
      return res.json({ notification });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  getNotification: async (req, res) => {
    try {
      console.log("req.user", req);
      const notifications = await Notifications.find({
        recipients: req.user._id,
      })
        .sort("-isRead")
        .populate({
          path: "user",
          select: "avatar fullname username",
        });
      console.log(
        "Notifications fetched: ",
        notifications.length,
        notifications
      );
      return res.json({ notifications });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

module.exports = notificationController;
