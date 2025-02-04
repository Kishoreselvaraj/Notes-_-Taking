require("dotenv").config();
const mongoose = require("mongoose");

const DB_NAME = "Notes Taking";

const connectToMongo = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(
      `✅ MongoDB connected! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection FAILED: ", error.message);
    process.exit(1);
  }
};

module.exports = { connectToMongo };
