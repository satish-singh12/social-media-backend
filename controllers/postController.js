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
        .populate({
          path: "user", // Populate the 'user' field
          select: "username avatar fullname", // Select only the fields you want from 'user'
        })
        .populate({
          path: "likes", // Populate the 'likes' field
          select: "username avatar fullname", // Select only the fields you want from 'likes'
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
};

module.exports = postController;
