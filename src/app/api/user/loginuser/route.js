// backend/api/users/login.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User";
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const loginUserHandler = async (request) => {
  try {
    // Extract the login credentials from the request body
    const { email, password } = await request.json();

    // Check if the email exists in the user database
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check if the password is correct
    if (password !== existingUser.password) {
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    // Create a payload for the JWT token (you can include additional data here)
    const payload = {
      userId: existingUser._id,
      userEmail: existingUser.email,
    };

    // Generate and sign the JWT token
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "9h" }); // Token expires in 9 hours

    // Return the token in the response
    return NextResponse.json(
      {
        message: "User login successful",
        token: token,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error during user login:", error);
    return NextResponse.json(
      {
        message: "Failed to perform user login",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = connectDb(loginUserHandler);
