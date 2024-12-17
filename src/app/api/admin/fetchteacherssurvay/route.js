// // Import necessary modules
// import { NextResponse } from "next/server";
// import connectDb from "../../../../../backend/middleware/db";
// import UserModel from "../../../../../backend/models/User"; // Import UserModel
// import SurveyModel from "../../../../../backend/models/Survey";

// // Define the handler function for fetching surveys submitted by teachers
// const fetchSurveysByTeachersHandler = async (request) => {
//   try {
//     // Fetch all surveys from the database
//     const allSurveys = await SurveyModel.find();

//     // Filter surveys submitted by teachers
//     const surveysByTeachers = await Promise.all(
//       allSurveys.map(async (survey) => {
//         // Check if there are any submissions by teachers
//         const hasSubmissionsByTeachers = await Promise.all(
//           survey.submittedUsers.map(async (submittedUser) => {
//             return await UserModel.findOne({ email: submittedUser.userEmail, userRole: "teacher" });
//           })
//         );

//         // If there are submissions by teachers, return the survey
//         if (hasSubmissionsByTeachers.some(Boolean)) {
//           // Filter out submitted users who are not teachers
//           const submittedUsers = await Promise.all(
//             survey.submittedUsers.map(async (submittedUser) => {
//               const user = await UserModel.findOne({ email: submittedUser.userEmail });
//               if (user && user.userRole === "teacher") {
//                 return {
//                   userName: submittedUser.userName, // Correct name
//                   userEmail: submittedUser.userEmail,
//                   answers: submittedUser.answers,
//                   submittedAt: submittedUser.submittedAt,
//                 };
//               }
//             })
//           );

//           // Filter out undefined users
//           const filteredUsers = submittedUsers.filter(user => user !== undefined);

//           return {
//             ...survey._doc,
//             submittedUsers: filteredUsers
//           };
//         }
//       })
//     );

//     // Remove null values (surveys with no submissions by teachers)
//     const filteredSurveys = surveysByTeachers.filter(survey => survey !== undefined);

//     return NextResponse.json(
//       {
//         surveys: filteredSurveys,
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     console.error("Error fetching surveys by teachers:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to fetch surveys by teachers",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// };

// // Export the handler function for the POST method
// export const POST = connectDb(fetchSurveysByTeachersHandler);
// Import necessary modules
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import SurveyModel from "../../../../../backend/models/Survey";

// Define the handler function for fetching all surveys
const fetchSurveysByTeachersHandler = async (request) => {
  try {
    // Fetch all surveys from the database
    const allSurveys = await SurveyModel.find();

    return NextResponse.json(
      {
        surveys: allSurveys,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch surveys",
      },
      {
        status: 500,
      }
    );
  }
};

// Export the handler function for the POST method
export const POST =  connectDb(fetchSurveysByTeachersHandler);
