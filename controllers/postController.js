const Posts = require("../models/postModel");

const postController = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;
      const newPosts = new Posts({
        content,
        images,
      });
      await newPosts.save();
      return res.status(200).json({ message: "Post saved", newPosts });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = postController;
