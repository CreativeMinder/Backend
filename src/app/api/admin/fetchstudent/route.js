// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User";

// Define the handler function for fetching students
const fetchStudentsHandler = async () => {
  try {
    // Query the database for users with the role "teacher"
    const students = await UserModel.find({ userRole: "student" });

    return NextResponse.json(
      {
        students,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch students",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the GET method
export const POST = connectDb(fetchStudentsHandler);
