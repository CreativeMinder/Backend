import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDb from "../../../../../backend/middleware/db";
import AdminModel from "../../../../../backend/models/Admin";
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const adminRegisterHandler = async (request) => {//async-->enable non-blocking operations.
  try {
    // Check if there's already an admin registered
    const existingAdminCount = await AdminModel.countDocuments();
    if (existingAdminCount > 0) {
      return NextResponse.json(
        {
          message: "Admin already registered",
        },
        {
          status: 400,
        }
      );
    }

    // Extract the registration details from the request body
    const { firstName, lastName, email, password } = await request.json();

    // Create a new admin
    const newAdmin = new AdminModel({
      firstName,
      lastName,
      email,
      password,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Create a payload for the JWT token
    const payload = {
      adminId: newAdmin._id,
      adminEmail: newAdmin.email,
    };

    // Generate and sign the JWT token
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "9h" }); 

    // Return the token in the response
    return NextResponse.json(
      {
        message: "Admin registered successfully",
        token: token,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error during admin registration:", error);
    return NextResponse.json(
      {
        message: "Failed to register admin",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = connectDb(adminRegisterHandler);
