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
      if (recipients.includes(req.user._id.toString())) return;
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
      const notifications = await Notifications.find({
        recipients: req.user._id,
      })
        .sort("createdAt")
        .populate({
          path: "user",
          select: "avatar fullname username",
        });
      return res.json({ notifications });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  isReadNotification: async (req, res) => {
    try {
      // Check if ID is provided
      if (!req.params.id) {
        return res
          .status(400)
          .json({ message: "Notification ID is required." });
      }

      const notifications = await Notifications.findOneAndUpdate(
        { _id: req.params.id },
        { isRead: true },
        { new: true } // This will return the updated document
      );

      if (!notifications) {
        return res.status(404).json({ message: "Notification not found." });
      }

      return res.json({ notifications });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  deleteAllNotification: async (req, res) => {
    console.log("req.user._id", req.user._id);
    try {
      const notifications = await Notifications.deleteMany({
        recipients: req.user._id,
      });
      return res.json({ notifications });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

module.exports = notificationController;
