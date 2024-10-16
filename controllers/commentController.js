const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");

const commentController = {
  createComment: async (req, res) => {
    try {
      const { content, postId, tag, reply } = req.body;

      const post = await Posts.findById(postId);
      if (!post) return res.status(400).json({ message: "No post found." });

      const newComment = await new Comments({
        user: req.user._id,
        content,
        tag,
        reply,
      });
      const post1 = await Posts.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        }
      );
      await newComment.save();
      return res.json({ newComment });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const { content } = req.body;

      await Comments.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { content }
      );

      return res.json({ message: "Update sucessfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  likeComment: async (req, res) => {
    try {
      const comment = await Comments.findOne({
        _id: req.params.id,
        comments: req.user._id,
      });
      // If the user already liked the post
      if (comment) {
        return res.status(400).json({
          message: "You have already liked this comment",
        });
      }

      await Comments.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      return res.json({
        message: "Comment likes",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  unlikeComment: async (req, res) => {
    try {
      await Comments.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
      return res.json({
        message: "Comment unliked",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = commentController;
