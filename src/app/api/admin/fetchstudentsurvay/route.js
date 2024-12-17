// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User"; // Import UserModel
import SurveyModel from "../../../../../backend/models/Survey";

// Define the handler function for fetching surveys submitted by teachers
// Define the handler function for fetching surveys submitted by students
const fetchSurveysByStudentsHandler = async (request) => {
  try {
    // Fetch all surveys from the database
    const allSurveys = await SurveyModel.find();

    // Filter surveys submitted by students
    const surveysByStudents = await Promise.all(
      allSurveys.map(async (survey) => {
        // Check if there are any submissions by students
        const hasSubmissionsByStudents = survey.submittedUsers.some(
          (submittedUser) => {
            return UserModel.findOne({
              email: submittedUser.userEmail,
              userRole: "student",
            });
          }
        );

        // If there are submissions by students, return the survey
        if (hasSubmissionsByStudents) {
          // Filter out submitted users who are not students
          const submittedUsers = survey.submittedUsers.filter(
            async (submittedUser) => {
              const user = await UserModel.findOne({
                email: submittedUser.userEmail,
              });
              return user && user.userRole === "student";
            }
          );

          return {
            ...survey._doc,
            submittedUsers: submittedUsers.map((user) => ({
              userName: user.firstName + " " + user.lastName,
              userEmail: user.email,
              answers: user.answers,
              
            })),
          };
        }
      })
    );

    // Remove null values (surveys with no submissions by students)
    const filteredSurveys = surveysByStudents.filter(
      (survey) => survey !== undefined
    );

    return NextResponse.json(
      {
        surveys: filteredSurveys,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching surveys by students:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch surveys by students",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the POST method
export const POST = connectDb(fetchSurveysByStudentsHandler);
