// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import ScoreModel from "../../../../../backend/models/Score";
import UserModel from "../../../../../backend/models/User";

// Define the handler function for fetching user score and role
const fetchUserScoreHandler = async (request) => {
  try {
    // Extract the userEmail from the request query or body (based on your frontend setup)
    const { userEmail } = await request.json(); // Or use request.query if sending via query params

    // Find the user by email
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find the user's score by their email
    const score = await ScoreModel.findOne({ userEmail });

    if (!score) {
      return NextResponse.json({ message: "Score not found for this user" }, { status: 404 });
    }

    // Prepare the response with user's role and score
    const response = {
      userRole: user.userRole, // Fetch user role from user schema
      firstName: user.firstName,
      lastName: user.lastName,
      universityName: user.universityName,
      score: score.score, // User's score from the score schema
      category: score.category, // The category of the score (quiz, exam, etc.)
    };

    return NextResponse.json({ message: "Data fetched successfully", data: response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user score and role:", error);
    return NextResponse.json(
      { message: "Failed to fetch data", error: error.message },
      { status: 500 }
    );
  }
};

// Export the handler function for the GET method, wrapped with connectDb
export const POST = connectDb(fetchUserScoreHandler);
