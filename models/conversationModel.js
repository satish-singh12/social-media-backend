const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    recipients: [{ type: mongoose.Types.ObjectId, ref: "users" }],
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("conversation", conversationSchema);

module.exports = Conversation;
