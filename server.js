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
const socketServer = require("./socketServer");

//MONGODB for database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(
  () => {
    console.log("Connected to DB...");
  },
  (err) => {
    console.log("Something went wrong...!!" + err);
  }
);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Activate CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Update with frontend URL
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(express.json());

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log(socket.id + " connected"); // Add space before 'connected'
  socketServer(socket);
});

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);
app.use("/api", notificationRouter);

http.listen(PORT, () => {
  console.log(`Server is running on PORT# ${PORT}`);
});
