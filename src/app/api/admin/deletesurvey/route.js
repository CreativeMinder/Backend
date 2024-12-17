// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import SurveyModel from "../../../../../backend/models/Survey";

// Define the handler function for deleting a survey
const deleteSurveyHandler = async (request) => {
  try {
    // Extract survey ID from the request body
    const { surveyId } = await request.json();

    // Find the survey in the database by ID and delete it
    const deletedSurvey = await SurveyModel.findByIdAndDelete(surveyId);

    // If survey doesn't exist, return an error
    if (!deletedSurvey) {
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
        message: "Survey deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting survey:", error);
    return NextResponse.json(
      {
        message: "Failed to delete survey",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the DELETE method
export const DELETE = connectDb(deleteSurveyHandler);