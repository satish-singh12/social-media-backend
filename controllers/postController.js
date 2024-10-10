const Posts = require("../models/postModel");

const postController = {
  createPost: async (req, res) => {
    try {
      const userId = req.params.id;
      const { content, images } = req.body;
      const newPosts = new Posts({
        content,
        images,
        user: userId,
      });
      await newPosts.save();
      return res.status(200).json({ message: "Post saved", newPosts });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const posts = await Posts.find({
        user: { $in: [...req.user.following, req.user._id] },
      })
        .sort("-createdAt")
        .populate({
          path: "user", // Populate the 'user' field
          select: "username avatar fullname", // Select only the fields you want from 'user'
        })
        .populate({
          path: "likes", // Populate the 'likes' field
          select: "username avatar fullname", // Select only the fields you want from 'likes'
        })
        .populate({
          path: "comments",
          populate: [
            {
              path: "user",
              select: "-password",
            },
            {
              path: "likes",
              select: "-password",
            },
          ],
        });
      // .populate("user likes", "username avatar fullname");

      if (!posts || posts.length === 0)
        return res.status(404).json({ message: "No posts found" });

      return res.status(200).json({
        message: "Posts found",
        result: posts.length,
        posts,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;

      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { content, images }
      )
        .populate({
          path: "user", // Populate the 'user' field
          select: "username avatar fullname", // Select only the fields you want from 'user'
        })
        .populate({
          path: "likes", // Populate the 'likes' field
          select: "username avatar fullname", // Select only the fields you want from 'likes'
        });

      return res.status(200).json({
        message: "Post updated",
        newPost: { ...post._doc, content, images },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  likePost: async (req, res) => {
    try {
      const post = await Posts.findOne({
        _id: req.params.id,
        likes: req.user._id,
      });
      // If the user already liked the post
      if (post) {
        return res.status(400).json({
          message: "You have already liked this post",
        });
      }

      await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      return res.json({
        message: "Post likes",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  unlikePost: async (req, res) => {
    try {
      await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
      return res.json({
        message: "Post unlikes",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = postController;
