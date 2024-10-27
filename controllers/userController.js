const Users = require("../models/userModel");
const bcrypt = require("bcrypt");

const userController = {
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username, $options: "i" },
      })
        .limit(10)
        .select("fullname username avatar");
      res.json({ users });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.params.id })
        .select("-password")
        .populate({
          path: "friends",
        })
        .populate({
          path: "following",
        });
      if (!user) return res.status(400).json({ message: "No Data Found" });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { website, fullname, story, phone, address, avatar } = req.body;
      if (!fullname) {
        return res.status(400).json({ message: "Fullname is requires" });
      }
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { website, fullname, story, phone, address, avatar }
      );
      return res.status(201).json({ message: "Updated successfully!" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await Users.findById({ _id: req.params.id });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  },

  friend: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.params.id,
        friends: req.user._id,
      });
      if (user.length > 0)
        return res.status(400).json({ message: "You have already following" });

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { friends: req.user._id },
        },
        { new: true }
      )
        .select("-password")
        .populate({
          path: "friends",
        })
        .populate({
          path: "following",
        });

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  unfriend: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { friends: req.user._id },
        },
        { new: true }
      )
        .select("-password")
        .populate({
          path: "friends",
        })
        .populate({
          path: "following",
        });

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params._id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userController;
