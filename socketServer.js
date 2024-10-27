let users = [];

const socketServer = (socket) => {
  socket.on("joinUser", (id) => {
    users.push({ id, socketId: socket.id });
    console.log({ users });
    // Emit the updated online users list
    socket.broadcast.emit(
      "getOnlineUsers",
      users.map((user) => user.id)
    );
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    console.log({ users });
    socket.broadcast.emit(
      "getOnlineUsers",
      users.map((user) => user.id)
    );
  });

  socket.on("likePost", (newPost) => {
    const ids = [...newPost.user.friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("likePostToClient", newPost);
      });
    }
  });
  socket.on("unlikePost", (newPost) => {
    const ids = [...newPost.user.friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("unlikePostToClient", newPost);
      });
    }
  });

  socket.on("createComment", (newPost) => {
    const ids = [...newPost.user.friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createCommentToClient", newPost);
      });
    }
  });

  socket.on("deleteComment", (newPost) => {
    const ids = [...newPost.user.friends, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("deleteCommentToClient", newPost);
      });
    }
  });

  socket.on("addFriend", (newUser) => {
    //console.log(newUser);
    const user = users.find((user) => user.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit("addFriendToClient", newUser);
  });

  socket.on("unFriend", (newUser) => {
    console.log(newUser);
    const user = users.find((user) => user.id === newUser._id);

    user && socket.to(`${user.socketId}`).emit("unFriendToClient", newUser);
  });

  socket.on("createNotification", (msg) => {
    const clients = users.filter((user) => msg.recipients.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createNotificationToClient", msg);
      });
    }
  });

  socket.on("removeNotification", (msg) => {
    const clients = users.filter((user) => msg.recipients.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("removeNotificationToClient", msg);
      });
    }
  });

  socket.on("deleteAllNotifications", (auth) => {
    const clients = users.filter((user) => user.id === auth.user._id);
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("deleteAllNotificationsToClient");
      });
    }
  });

  socket.on("addMessage", (msg) => {
    const user = users.find((user) => user.id === msg.recipient);

    user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
  });

  socket.on("deleteMessage", (msgId) => {
    const user = users.find((user) => user.id === msgId.recipient);
    if (user) {
      socket.to(`${user.socketId}`).emit("deleteMessageToClient", msgId);
    }
  });

  socket.on("deleteAllMessages", (data) => {
    const { id, recipientId } = data;
    const user = users.find((user) => user.id === recipientId);
    if (user) {
      socket.to(`${user.socketId}`).emit("deleteAllMessagesToClient", id);
    }
  });
};

module.exports = socketServer;
