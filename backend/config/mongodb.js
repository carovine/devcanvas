import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
