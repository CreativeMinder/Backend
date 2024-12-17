import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import SurveyModel from "../../../../../backend/models/Survey";

const createSurveyHandler = async (request) => {
  try {
    // Extract survey details from the request body
    const { surveyName, questions } = await request.json();

    // Check if a survey with the same name already exists
    const existingSurvey = await SurveyModel.findOne({ surveyName });
    if (existingSurvey) {
      return NextResponse.json(
        {
          message: "Survey with this name already exists",
        },
        {
          status: 400,
        }
      );
    }

    // Create a new survey
    const newSurvey = new SurveyModel({
      surveyName,
      questions,
    });

    // Save the new survey to the database
    await newSurvey.save();

    return NextResponse.json(
      {
        message: "Survey created successfully",
        survey: newSurvey,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating survey:", error);
    return NextResponse.json(
      {
        message: "Failed to create survey",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = connectDb(createSurveyHandler);
