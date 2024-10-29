let users = [];

const socketServer = (socket) => {
  socket.on("joinUser", (id) => {
    const existingUserIndex = users.findIndex((user) => user.id === id);
    if (existingUserIndex !== -1) {
      users[existingUserIndex].socketId = socket.id;
    } else {
      users.push({ id, socketId: socket.id });
    }

    console.log({ users });
    socket.broadcast.emit(
      "getOnlineUsers",
      users.map((user) => user.id)
    );
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    socket.broadcast.emit(
      "getOnlineUsers",
      users.map((user) => user.id)
    );
  });

  socket.on("likePost", (newPost) => {
    const friends = Array.isArray(newPost.user.friends)
      ? newPost.user.friends
      : [];
    const ids = [...friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    clients.forEach((client) => {
      socket.to(client.socketId).emit("likePostToClient", newPost);
    });
  });

  socket.on("unlikePost", (newPost) => {
    const friends = Array.isArray(newPost.user.friends)
      ? newPost.user.friends
      : [];
    const ids = [...friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    clients.forEach((client) => {
      socket.to(client.socketId).emit("unlikePostToClient", newPost);
    });
  });

  socket.on("createComment", (newPost) => {
    const friends = Array.isArray(newPost.user.friends)
      ? newPost.user.friends
      : [];
    const ids = [...friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    clients.forEach((client) => {
      socket.to(client.socketId).emit("createCommentToClient", newPost);
    });
  });

  socket.on("deleteComment", (newPost) => {
    const friends = Array.isArray(newPost.user.friends)
      ? newPost.user.friends
      : [];
    const ids = [...friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    clients.forEach((client) => {
      socket.to(client.socketId).emit("deleteCommentToClient", newPost);
    });
  });

  socket.on("addFriend", (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    user?.socketId &&
      socket.to(user.socketId).emit("addFriendToClient", newUser);
  });

  socket.on("unFriend", (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    user?.socketId &&
      socket.to(user.socketId).emit("unFriendToClient", newUser);
  });

  socket.on("createNotification", (msg) => {
    const clients = users.filter((user) => msg.recipients.includes(user.id));
    clients.forEach((client) => {
      socket.to(client.socketId).emit("createNotificationToClient", msg);
    });
  });

  socket.on("removeNotification", (msg) => {
    const clients = users.filter((user) => msg.recipients.includes(user.id));
    clients.forEach((client) => {
      socket.to(client.socketId).emit("removeNotificationToClient", msg);
    });
  });

  socket.on("deleteAllNotifications", (auth) => {
    const clients = users.filter((user) => user.id === auth.user._id);
    clients.forEach((client) => {
      socket.to(client.socketId).emit("deleteAllNotificationsToClient");
    });
  });

  socket.on("addMessage", (msg) => {
    const user = users.find((user) => user.id === msg.recipient);
    user?.socketId && socket.to(user.socketId).emit("addMessageToClient", msg);
  });

  socket.on("deleteMessage", (msgId) => {
    const user = users.find((user) => user.id === msgId.recipient);
    user?.socketId &&
      socket.to(user.socketId).emit("deleteMessageToClient", msgId);
  });

  socket.on("deleteAllMessages", (data) => {
    const { id, recipientId } = data;
    const user = users.find((user) => user.id === recipientId);
    user?.socketId &&
      socket.to(user.socketId).emit("deleteAllMessagesToClient", id);
  });

  socket.on("getMessage", (msg) => {
    const user = users.find((user) => user.id === msg.recipient);
    user?.socketId && socket.to(user.socketId).emit("getMessageToClient", msg);
  });
};

module.exports = socketServer;
