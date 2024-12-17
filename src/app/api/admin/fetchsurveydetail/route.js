import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import SurveyModel from "../../../../../backend/models/Survey";

const getSurveyDetailHandler = async (request) => {
  try {
    // Extract survey ID from the request body
    const { surveyId } = await request.json();

    // Find the survey in the database by ID
    const survey = await SurveyModel.findById(surveyId);

    // If survey doesn't exist, return an error
    if (!survey) {
      return NextResponse.json(
        {
          message: "Survey not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        survey,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching survey details:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch survey details",
      },
      {
        status: 500,
      }
    );
  }
};


export const POST = connectDb(getSurveyDetailHandler);
