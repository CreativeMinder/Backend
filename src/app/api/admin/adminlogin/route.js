

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import AdminModel from "../../../../../backend/models/Admin";
import connectDb from "../../../../../backend/middleware/db";
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const adminLoginHandler = async (request) => {
  
  try {
    // Extract the login credentials from the request body
    const { email, password } = await request.json();
   
    // Check if the email exists in the admin database
    const existingAdmin = await AdminModel.findOne({ email });
    if (!existingAdmin) {
      return NextResponse.json(
        {
          message: "Admin not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check if the password is correct
    if (existingAdmin.password !== password) {
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
      adminId: existingAdmin._id,
      adminEmail: existingAdmin.email,
     
    };

    // Generate and sign the JWT token
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "9h" }); // Token expires in 9 hours

    // Return the token in the response
    return NextResponse.json(
      {
        message: "Admin login successful",
        token: token,
       
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error during admin login:", error);
    return NextResponse.json(
      {
        message: "Failed to perform admin login",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = connectDb(adminLoginHandler);
