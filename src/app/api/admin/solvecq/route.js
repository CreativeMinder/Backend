// Import necessary modules and models
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import CqModel from "../../../../../backend/models/Cq";

const submitCqHandler = async (request) => {
  try {
    const { userId, so1, so2, so3, so4, so5, so6, so7, so8, so9 } = await request.json();

    // Create a new `cq` entry
    const newCqEntry = new CqModel({
      filledBy: userId,
      so1,
      so2,
      so3,
      so4,
      so5,
      so6,
      so7,
      so8,
      so9,
    });

    // Save the new `cq` entry to the database
    await newCqEntry.save();

    return NextResponse.json(
      {
        message: "CQ submitted successfully",
        cqEntry: newCqEntry,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error submitting CQ:", error);
    return NextResponse.json(
      {
        message: "Failed to submit CQ",
      },
      {
        status: 500,
      }
    );
  }
};

// Connect the handler function to the POST method
export const POST = connectDb(submitCqHandler);
