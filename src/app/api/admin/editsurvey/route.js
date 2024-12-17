// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import SurveyModel from "../../../../../backend/models/Survey";

// Define the handler function for editing a survey
const editSurveyHandler = async (request) => {
  try {
    // Extract survey data from the request body
    const { surveyId, updatedSurvey } = await request.json();

    // Find the survey in the database by ID and update it
    const updated = await SurveyModel.findByIdAndUpdate(
      surveyId,
      updatedSurvey,
      { new: true }
    );

    // If survey doesn't exist, return an error
    if (!updated) {
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
        message: "Survey updated successfully",
        updatedSurvey: updated,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating survey:", error);
    return NextResponse.json(
      {
        message: "Failed to update survey",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the PUT method
export const PUT = connectDb(editSurveyHandler);
