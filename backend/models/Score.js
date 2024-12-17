import mongoose from "mongoose";

// Define the score schema
const scoreSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, ref: "users" }, // Reference to user by email
  category: { type: String, required: true }, // e.g., a quiz or exam category
  score: { type: Number, required: true }, // User's score
});

// Create the Score model
const ScoreModel = mongoose.models.scores || mongoose.model("scores", scoreSchema);

export default ScoreModel;
