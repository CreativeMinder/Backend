import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  surveyName: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      questionType: { type: String, enum: ["mcq", "detail"], required: true },
      options: [{ type: String }], // Array of options for MCQ type questions
    },
  ],
  date: { type: Date, default: Date.now },
  submittedUsers: [
    {
      userEmail: { type: String },
      answers: [
        {
          questionIndex: { type: Number, required: true },
          answerText: { type: String, required: true },
        },
      ],
      submittedAt: { type: Date, default: Date.now }, // New field to store submission date
    },
  ],
});

const SurveyModel =
  mongoose.models.surveys || mongoose.model("surveys", surveySchema);

export default SurveyModel;
