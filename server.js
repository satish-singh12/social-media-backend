require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoute");
const commentRouter = require("./routes/commentRoute");
const notificationRouter = require("./routes/notificationRoute");
const messageRouter = require("./routes/messageRoute");
const socketServer = require("./socketServer");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    console.log("Connected to DB...");
  } catch (err) {
    console.error("Failed to connect to DB:", err);
  }
};

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://social-media-frontend-vert-eight.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socketServer(socket);
});

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);
app.use("/api", notificationRouter);
app.use("/api", messageRouter);

http.listen(PORT, () => {
  console.log(`Server is running on PORT# ${PORT}`);
});
