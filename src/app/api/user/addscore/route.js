// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import ScoreModel from "../../../../../backend/models/Score";
import UserModel from "../../../../../backend/models/User";

// Define the handler function for saving or updating user score
const saveUserScoreHandler = async (request) => {
  try {
    // Extract data from the request body
    const { userEmail, score, category } = await request.json();

    // Validate that the user exists in the system
    const userExists = await UserModel.findOne({ email: userEmail });

    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if a score already exists for this user (based only on userEmail)
    const existingScore = await ScoreModel.findOne({ userEmail });

    if (existingScore) {
      // Update the existing score with the new one
      existingScore.score = score;
      existingScore.category = category; // Optionally update the category if needed
      await existingScore.save();

      return NextResponse.json(
        { message: "Score updated successfully" },
        { status: 200 }
      );
    } else {
      // Create a new score entry if no previous score exists
      const newScore = new ScoreModel({
        userEmail,
        score,
        category,
      });

      await newScore.save();

      return NextResponse.json(
        { message: "Score saved successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error saving or updating score:", error);
    return NextResponse.json(
      { message: "Failed to save or update score", error: error.message },
      { status: 500 }
    );
  }
};

// Export the handler function for the POST method, wrapped with connectDb
export const POST = connectDb(saveUserScoreHandler);
