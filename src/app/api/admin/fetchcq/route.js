// Import necessary modules and models
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import CqModel from "../../../../../backend/models/Cq";

const fetchCqHandler = async (request) => {
  try {
   

    const cqEntries = await CqModel.find();

    if (cqEntries.length === 0) {
      return NextResponse.json(
        {
          message: "No CQ entries found for this user",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "CQ entries fetched successfully",
        cqEntries,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching CQ entries:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch CQ entries",
      },
      {
        status: 500,
      }
    );
  }
};

// Connect the handler function to the POST method
export const POST = connectDb(fetchCqHandler);
