// Import necessary modules
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Define the handler function for sending bulk emails
const sendBulkEmailHandler = async (request) => {
  try {
    // Extract data from the request body
    const { emails, subject, htmlContent } = await request.json();

    // Validate that emails are provided
    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ message: "No email addresses provided" }, { status: 400 });
    }

    // Create a transporter using Gmail with app password
    //for establish a connection to an email server, which allows us to send emails programmatically.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "obe.recommendations@gmail.com", // Your Gmail address
        pass: "jtxt wrey rrsx vasu", // Gmail app password
      },
    });

    // Prepare mail options
    const mailOptions = {
      from: "obe.recommendations@gmail.com", // Use the same Gmail address
      bcc: emails.join(", "), // Send email to multiple recipients
      subject: subject,
      html: htmlContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Bulk email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending bulk email:", error);
    return NextResponse.json(
      { message: "Failed to send bulk email", error: error.message },
      { status: 500 }
    );
  }
};

// Export the handler function for the POST method
export const POST = sendBulkEmailHandler;
