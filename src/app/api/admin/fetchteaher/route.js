// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User";

// Define the handler function for fetching teachers
const fetchTeachersHandler = async () => {
  try {
    // Query the database for users with the role "teacher"
    const teachers = await UserModel.find({ userRole: "teacher" });

    return NextResponse.json(
      {
        teachers,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch teachers",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the GET method
export const POST = connectDb(fetchTeachersHandler);
