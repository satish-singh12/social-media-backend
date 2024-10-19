const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    id: { type: mongoose.Types.ObjectId },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    recipients: [mongoose.Types.ObjectId],
    url: String,
    content: String,
    image: String,
    text: String,
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("notification", NotificationSchema);

module.exports = Notification;
