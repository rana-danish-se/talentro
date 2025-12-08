import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    proposal: {
      type: String,
      required: [true, "Proposal is required"],
      maxlength: 2000,
    },
    estimatedDuration: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
    selectedMode: {
      type: String,
      enum: ["hybrid", "barter", "paid"],
      required: [true, "Selected mode is required"],
    },
    attachments: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ applicantId: 1, createdAt: -1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
