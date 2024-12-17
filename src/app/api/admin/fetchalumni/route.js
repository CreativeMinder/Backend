// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User";

// Define the handler function for fetching alumnis
const fetchAlumniHandler = async () => {
  try {
    // Query the database for users with the role "teacher"
    const alumnis = await UserModel.find({ userRole: "alumni" });

    return NextResponse.json(
      {
        alumnis,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching alumnis:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch alumnis",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the GET method
export const POST = connectDb(fetchAlumniHandler);
