import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userRole: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  universityName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.models.users || mongoose.model("users", userSchema);

export default UserModel;
