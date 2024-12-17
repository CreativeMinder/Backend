// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import UserModel from "../../../../../backend/models/User"; // Import UserModel
import SurveyModel from "../../../../../backend/models/Survey";

// Define the handler function for fetching surveys submitted by employees
const fetchSurveysByEmployeesHandler = async () => {
    try {
      // Fetch all surveys from the database
      const allSurveys = await SurveyModel.find();
  
      // Filter surveys submitted by employees
      const surveysByEmployees = await Promise.all(
        allSurveys.map(async (survey) => {
          // Check if there are any submissions by employees
          const hasSubmissionsByEmployees = survey.submittedUsers.some(
            (submittedUser) => {
              return UserModel.findOne({
                email: submittedUser.userEmail,
                userRole: "employee",
              });
            }
          );
  
          // If there are submissions by employees, return the survey
          if (hasSubmissionsByEmployees) {
            // Filter out submitted users who are not employees
            const submittedUsers = survey.submittedUsers.filter(
              async (submittedUser) => {
                const user = await UserModel.findOne({
                  email: submittedUser.userEmail,
                });
                return user && user.userRole === "employee";
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
  
      // Remove null values (surveys with no submissions by employees)
      const filteredSurveys = surveysByEmployees.filter(
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
      console.error("Error fetching surveys by employees:", error);
      return NextResponse.json(
        {
          message: "Failed to fetch surveys by employees",
        },
        {
          status: 500,
        }
      );
    }
  };
  
  // Export the handler function for the POST method
  export const POST = connectDb(fetchSurveysByEmployeesHandler);
  
  