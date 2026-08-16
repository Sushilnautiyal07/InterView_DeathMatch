import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: Number,
  strengths: String,
  improvements: String,
});

const violationSchema = new mongoose.Schema({
  type: String,
  timestamp: { type: Date, default: Date.now },
});

const interviewSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  candidateId: String,
  jobRole: String,
  jobLevel: String,
  jobDescription: String,
  status: {
    type: String,
    enum: ["in_progress", "completed", "terminated"],
    default: "in_progress"
  },
  questions: [questionSchema],
  violations: [violationSchema],
  overallScore: Number,
  startTime: { type: Date, default: Date.now },
  endTime: Date,
}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);