import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import SurveyModel from "../../../../../backend/models/Survey";

const getAllSurveysHandler = async (request) => {
  try {
    // Fetch all surveys from the database
    const surveys = await SurveyModel.find();

    return NextResponse.json(
      {
        surveys,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch surveys",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = connectDb(getAllSurveysHandler);
