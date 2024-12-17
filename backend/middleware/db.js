import mongoose from "mongoose"; //for db connection
import { NextResponse } from "next/server";
require("dotenv").config(); //pkg for getting data from .env files

const connectDb = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error(
        process.env.MONGO_URI,
        "Failed to connect to MongoDB:",
        error
      );
      // Handle the error as needed
      return NextResponse.json(
        {
          message: "Failed to connect to MongoDB",
        },
        {
          status: 500,
        }
      );
    }
  }

  return handler(req, res);
};

export default connectDb;
