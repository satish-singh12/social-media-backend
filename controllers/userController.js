const Users = require("../models/userModel");

const userController = {
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username },
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
      const user = await Users.findOne({ _id: req.params.id }).select(
        "-password"
      );
      if (!user) return res.status(400).json({ message: "No user exists" });

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
};

module.exports = userController;
