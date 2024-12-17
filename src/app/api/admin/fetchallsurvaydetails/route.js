// Path: app/api/surveys/unsubmitted/route.js
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import SurveyModel from "../../../../../backend/models/Survey";
import UserModel from "../../../../../backend/models/User";

const getSurveysWithUnsubmittedUsersHandler = async () => {
  try {
    // Fetch all surveys
    const surveys = await SurveyModel.find();
    
    // Fetch all users
    const users = await UserModel.find({}, { email: 1 });

    // Map of all user emails
    const allUserEmails = users.map((user) => user.email);

    // Add unsubmitted users to each survey
    const surveysWithUnsubmittedUsers = surveys.map((survey) => {
      const submittedEmails = survey.submittedUsers.map(
        (submittedUser) => submittedUser.userEmail
      );

      // Find users who have not submitted the survey
      const unsubmittedUsers = allUserEmails.filter(
        (email) => !submittedEmails.includes(email)
      );

      return {
        ...survey.toObject(),
        unsubmittedUsers,
      };
    });

    return NextResponse.json(
      {
        surveys: surveysWithUnsubmittedUsers,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching surveys with unsubmitted users:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch surveys with unsubmitted users",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = connectDb(getSurveysWithUnsubmittedUsersHandler);
