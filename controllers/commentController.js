const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");

const commentController = {
  createComment: async (req, res) => {
    try {
      // const {content, postId, tag, reply} = req.body;
      // const newComment = new Comments({
      //     user: req.user._id, content, tag, reply
      // })
      // const post = Posts.findOneAndUpdate({_id: postId}, $push:{comments})
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = commentController;
