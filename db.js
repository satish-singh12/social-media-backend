const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true, // Use the new topology engine
    });
    console.log("Connected to DB...");
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
