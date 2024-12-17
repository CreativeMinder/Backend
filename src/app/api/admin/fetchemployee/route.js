// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User";

// Define the handler function for fetching employees
const fetchEmployeeHandler = async () => {
  try {
    // Query the database for users with the role "teacher"
    const employees = await UserModel.find({ userRole: "employee" });

    return NextResponse.json(
      {
        employees,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch employees",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the GET method
export const POST = connectDb(fetchEmployeeHandler);
