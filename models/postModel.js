const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    content: String,
    images: {
      type: Array,
      default: [],
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "users" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    user: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
