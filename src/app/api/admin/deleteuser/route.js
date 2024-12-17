// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User";

// Define the handler function for deleting a user
const deleteUserHandler = async (request) => {
  try {
    // Extract userId from the request body
    const { userId } = await request.json();

    // Find the user by ID and delete it
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    // If user doesn't exist, return an error
    if (!deletedUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "User deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        message: "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the DELETE method
export const DELETE = connectDb(deleteUserHandler);
