const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    // content: String,
    // user: { type: mongoose.Types.ObjectId, ref: "users" }, // Reference to the user who made the comment
    // post: { type: mongoose.Types.ObjectId, ref: "post" }, // Reference to the post being commented on
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
