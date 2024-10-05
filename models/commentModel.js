const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {},
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
