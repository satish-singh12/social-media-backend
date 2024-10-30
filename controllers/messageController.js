const Conversations = require("../models/conversationModel");
const Messages = require("../models/messageModel");

const messageController = {
  createMessage: async (req, res) => {
    try {
      const { recipient, text, media } = req.body;
      console.log({ recipient, text, media });

      if (!recipient || (!text.trim() && media.length === 0))
        return res
          .status(400)
          .json({ message: "Recipient or content missing" });

      // Step 1: Check if the conversation already exists
      let conversation = await Conversations.findOne({
        recipients: { $all: [req.user._id, recipient] },
      });

      // Step 2: If the conversation doesn’t exist, create a new one
      if (!conversation) {
        conversation = new Conversations({
          recipients: [req.user._id, recipient],
          text,
          media,
        });
        await conversation.save();
      } else {
        // Step 3: If it exists, update the conversation's text and media
        conversation.text = text;
        conversation.media = media;
        await conversation.save();
      }

      // Step 4: Create a new message in the existing or new conversation
      const newMessage = new Messages({
        conversation: conversation._id,
        sender: req.user._id,
        recipient,
        text,
        media,
      });

      await newMessage.save();
      return res.status(200).json({ newMessage, conversation });
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

      return res
        .status(200)
        .json({ conversation, result: conversation.length });
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
          select: "avatar fullname username",
        });
      return res.status(200).json({ message, result: message.length });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deleteMessages: async (req, res) => {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;

    console.log(id, userId);

    if (!id || !userId) {
      return res.status(400).json({
        message: "Invalid request: Message ID and user ID are required.",
      });
    }

    try {
      const message = await Messages.findOneAndDelete({
        _id: id,
        sender: userId,
      });

      if (!message) {
        return res.status(404).json({
          message: "Message not found or you're not authorized to delete it.",
        });
      }

      return res.status(200).json({ message: "Deleted!" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deleteAllMessages: async (req, res) => {
    try {
      const userId = req.params.id;
      const authUserId = req.user._id;
      console.log(userId, authUserId);

      // Delete all messages where either user is sender and recipient
      await Messages.deleteMany({
        $or: [
          { sender: authUserId, recipient: userId },
          { sender: userId, recipient: authUserId },
        ],
      });

      res.status(200).json({ msg: "All messages deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error deleting messages", error });
    }
  },
};

module.exports = messageController;
