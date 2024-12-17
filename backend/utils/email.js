const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (emails, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service
      auth: {
        user: "obe.recommendations@gmail.com", // Your Gmail address
        pass: "Paradigm%2021", // Your Gmail password
      },
    });

    // Prepare mail options
    const mailOptions = {
      from: "obe.recommendations@gmail.com", // Sender email
      bcc: emails.join(", "), // Send email to multiple recipients
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    console.log("Bulk email sent successfully");
  } catch (error) {
    console.log("Bulk email not sent");
    console.log(error);
  }
};
