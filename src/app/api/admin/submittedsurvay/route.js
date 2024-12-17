// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import SurveyModel from "../../../../../backend/models/Survey";

// Define the handler function for checking survey submission
const checkSurveySubmissionHandler = async (request) => {
  try {
    // Extract user's email from the request body
    const { email: userEmail } = await request.json();

    // Validate the email
    if (!userEmail) {
      return NextResponse.json(
        { message: "User email is required" },
        { status: 400 }
      );
    }

    // Fetch all surveys from the database
    const surveys = await SurveyModel.find();

    // Initialize arrays for submitted and remaining surveys
    const submittedSurveys = [];
    const remainingSurveys = [];

    // Iterate through all surveys to categorize them
    surveys.forEach((survey) => {
      const hasSubmitted = survey.submittedUsers.some(
        (user) => user.userEmail === userEmail
      );

      if (hasSubmitted) {
        submittedSurveys.push(survey);
      } else {
        remainingSurveys.push(survey);
      }
    });

    // Return the categorized surveys
    return NextResponse.json(
      {
        submittedSurveys,
        remainingSurveys,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking survey submission:", error);
    return NextResponse.json(
      {
        message: "Failed to check survey submission",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the POST method
export const POST = connectDb(checkSurveySubmissionHandler);
