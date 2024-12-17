// backend/api/users/register.js
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User";
require("dotenv").config();

const registerUserHandler = async (request) => {
  try {
    const { userRole, firstName, lastName, universityName, email, password } =
      await request.json();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists with this email",
        },
        {
          status: 400,
        }
      );
    }

    // Create a new user
    const newUser = new UserModel({
      userRole,
      firstName,
      lastName,
      universityName,
      email,
      password,
    });

    // Save the new user to the database
    await newUser.save();

    // Return success response
    return NextResponse.json(
      {
        message: "User registered successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        message: "Failed to register user",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = connectDb(registerUserHandler);
