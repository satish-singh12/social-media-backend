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

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT# ${PORT}`);
});
