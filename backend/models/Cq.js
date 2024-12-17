import mongoose from "mongoose";

const cqSchema = new mongoose.Schema({
  filledBy: { type: String, required: true },
  so1: { type: String, required: true },
  so2: { type: String, required: true },
  so3: { type: String, required: true },
  so4: { type: String, required: true },
  so5: { type: String, required: true },
  so6: { type: String, required: true },
  so7: { type: String, required: true },
  so8: { type: String, required: true },
  so9: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CqModel = mongoose.models.cq || mongoose.model("cq", cqSchema);

export default CqModel;
