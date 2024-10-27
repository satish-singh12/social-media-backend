const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: "conversation1" },
    sender: { type: mongoose.Types.ObjectId, ref: "users" },
    recipient: { type: mongoose.Types.ObjectId, ref: "users" },
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("message1", messageSchema);

module.exports = Message;
