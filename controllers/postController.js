const mongoose = require("mongoose");
const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const Comments = require("../models/commentModel");

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
      return res.status(200).json({
        message: "Post saved",
        newPosts: {
          ...newPosts._doc,
          user: req.user,
        },
      });
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
          select: "username avatar fullname friends", // Select only the fields you want from 'user'
        })
        .populate({
          path: "likes", // Populate the 'likes' field
          select: "username avatar fullname friends", // Select only the fields you want from 'likes'
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

      if (!post) return res.status(400).json({ message: "No post found." });

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

      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );
      if (!like) return res.status(400).json({ message: "No post found." });

      return res.json({
        message: "Post likes",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  unlikePost: async (req, res) => {
    try {
      const unlike = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
      if (!unlike) return res.status(400).json({ message: "No post found." });
      return res.json({
        message: "Post unlikes",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getSavedPost: async (req, res) => {
    try {
      const savedPosts = await Posts.find({
        _id: { $in: req.user.saved },
      })
        .sort("-createdAt")
        .populate({
          path: "user", // Populate the 'user' field
          select: "username avatar fullname", // Select only the fields you want from 'user'
        })
        .populate({
          path: "likes", // Populate the 'likes' field
          select: "username avatar fullname", // Select only the fields you want from 'likes'
        });

      return res.json({ savedPosts });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  savedPost: async (req, res) => {
    try {
      const user = await Users.findOne({
        _id: req.user.id,
        saved: req.params._id,
      });
      // If the user already liked the post
      if (user) {
        return res.status(400).json({
          message: "Already saved this post",
        });
      }

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        { new: true }
      );

      return res.json({
        message: "Post saved",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  unSavedPost: async (req, res) => {
    try {
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { saved: req.params.id },
        },
        { new: true }
      );

      return res.json({
        message: "Post unsaved",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getUserPost: async (req, res) => {
    try {
      const { id } = req.params;
      // Validate if the id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const posts = await Posts.find({ user: id })
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "username avatar fullname",
        })
        .populate({
          path: "likes",
          select: "username avatar fullname",
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
      // if (!posts || posts.length === 0)
      //   return res.status(404).json({ message: "No posts found.." });

      return res.status(200).json({
        message: "Posts found",
        result: posts.length,
        posts,
      });
    } catch (err) {
      console.error("Error fetching posts:", err); // Log error to server console
      return res.status(500).json({ message: err.message });
    }
  },

  getSinglePost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id)
        .populate({
          path: "user",
          select: "username avatar fullname friends",
        })
        .populate({
          path: "likes",
          select: "username avatar fullname friends",
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

      if (!post) return res.status(400).json({ message: "No post found." });

      return res.status(200).json({
        post,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await Comments.deleteMany({ _id: { $in: post.comments } });
      return res.status(200).json({
        message: "deleted successfully",
        newPosts: {
          ...post,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
module.exports = postController;
