// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User";

// Define the handler function for editing a user
const editUserHandler = async (request) => {
  try {
    // Extract userId and updated user details from the request body
    const { userId, updatedUser } = await request.json();

    // Find the user by ID and update the details
    const updated = await UserModel.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });

    // If user doesn't exist, return an error
    if (!updated) {
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
        message: "User updated successfully",
        updatedUser: updated,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        message: "Failed to update user",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the PUT method
export const PUT = connectDb(editUserHandler);
