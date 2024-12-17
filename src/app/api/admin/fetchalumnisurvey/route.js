// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User"; // Import UserModel
import SurveyModel from "../../../../../backend/models/Survey";

const fetchAlumniSurveysHandler = async (request) => {
    try {
      // Fetch all surveys from the database
      const allSurveys = await SurveyModel.find();
  
      // Filter surveys submitted by alumni
      const alumniSurveys = await Promise.all(
        allSurveys.map(async (survey) => {
          // Check if there are any submissions by alumni
          const hasSubmissionsByAlumni = survey.submittedUsers.some(
            (submittedUser) => {
              return UserModel.findOne({
                email: submittedUser.userEmail,
                userRole: "alumni",
              });
            }
          );
  
          // If there are submissions by alumni, return the survey
          if (hasSubmissionsByAlumni) {
            // Filter out submitted users who are not alumni
            const submittedUsers = survey.submittedUsers.filter(
              async (submittedUser) => {
                const user = await UserModel.findOne({
                  email: submittedUser.userEmail,
                });
                return user && user.userRole === "alumni";
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
  
      // Remove null values (surveys with no submissions by alumni)
      const filteredSurveys = alumniSurveys.filter(
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
      console.error("Error fetching alumni surveys:", error);
      return NextResponse.json(
        {
          message: "Failed to fetch alumni surveys",
        },
        {
          status: 500,
        }
      );
    }
  };
  
  // Export the handler function for the POST method
  export const POST = connectDb(fetchAlumniSurveysHandler);
  