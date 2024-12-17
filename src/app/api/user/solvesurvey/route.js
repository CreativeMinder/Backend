// Import necessary modules and models
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import SurveyModel from "../../../../../backend/models/Survey";

// Define the handler function for submitting survey responses
const submitSurveyHandler = async (request) => {
  try {
    // Extract survey id, user email, and answers from the request body
    const { surveyId, userEmail, answers } = await request.json();

    // Find the survey by its id
    const survey = await SurveyModel.findById(surveyId);
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

    // Update submittedUsers array with user's answers and submission date
    survey.submittedUsers.push({
      userEmail,
      answers,
      submittedAt: new Date(), // Add the submission date
    });

    // Save the updated survey
    await survey.save();

    return NextResponse.json(
      {
        message: "Survey submitted successfully",
        survey,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json(
      {
        message: "Failed to submit survey",
      },
      {
        status: 500,
      }
    );
  }
};

// Connect the handler function to the POST method
export const POST = connectDb(submitSurveyHandler);
