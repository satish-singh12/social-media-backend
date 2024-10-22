const Conversations = require("../models/conversationModel");
const Messages = require("../models/messageModel");

const messageController = {
  createMessage: async (req, res) => {
    try {
      const { recipient, text, media } = req.body;
      if (!recipient || (!text.trim() && media.length === 0)) return;

      const newConversation = await Conversations.findOneAndUpdate(
        {
          $or: [
            { recipients: [req.user._id, recipient] },
            { recipients: [recipient, req.user._id] },
          ],
        },
        {
          recipients: [req.user._id, recipient],
          text,
          media,
        },
        {
          new: true,
          upsert: true,
        }
      );
      const newMessage = new Messages({
        conversation: newConversation._id,
        sender: req.user._id,
        recipient,
        text,
        media,
      });
      await newMessage.save();
      res.status(200).json({ newConversation });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getConversations: async (req, res) => {
    try {
      const conversation = await Conversations.find({
        recipients: req.user._id,
      })
        .sort("updatedAt")
        .populate({
          path: "recipients",
          select: "avatar fullname username",
        });

      res.status(200).json({ conversation, result: conversation.length });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getMessages: async (req, res) => {
    try {
      const message = await Messages.find({
        $or: [
          {
            sender: req.user._id,
            recipient: req.params.id,
          },
          {
            sender: req.params.id,
            recipient: req.user._id,
          },
        ],
      })
        .sort("createdAt")
        .populate({
          path: "recipient",
          // path: "sender recipient",
          select: "avatar fullname username",
        });
      console.log(message);
      res.status(200).json({ message, result: message.length });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deleteMessages: async (req, res) => {
    console.log("id-------", req.params.id, req.user._id);
    try {
      const messages = await Messages.findOneAndDelete({
        _id: req.params.id,
        sender: req.user._id,
      });
      req.status(201).json({ message: "Deleted..!" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = messageController;
