import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  experience: {
    type: String,
    required: true,
    enum: ["none", "beginner", "intermediate", "advanced"],
  },
  motivation: {
    type: String,
    required: true,
    trim: true,
  },
  course_interest: {
    type: String,
    required: true,
    enum: [
      "frontend",
      "backend",
      "fullstack",
      "data_science",
      "cyber_security",
      "ui_ux",
    ],
  },
  commitment: {
    type: String,
    required: true,
    enum: ["full_time", "part_time"],
  },
});

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;