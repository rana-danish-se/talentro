import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: 5000,
    },
    industry: {
      type: String,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    mode: {
      type: [String],
      enum: ["hybrid", "barter", "paid"],
      default: ["paid"],
    },
    servicesOffered: [
      {
        type: String,
        trim: true,
      },
    ],
    deadline: {
      type: Date,
    },
    applicationDeadline: {
      type: Date,
    },
    removeDate: {
      type: Date,
    },
    attachments: [
      {
        type: String,
      },
    ],
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      city: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0],
          index: "2dsphere",
        },
        address: String,
      },
    },
    status: {
      type: String,
      enum: ["active", "closed", "filled", "draft"], 
      default: "active",
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
jobSchema.index({ userId: 1, createdAt: -1 });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ industry: 1, status: 1 });
jobSchema.index({ "location.coordinates": "2dsphere" });

// Virtual for checking if job is expired
jobSchema.virtual("isExpired").get(function () {
  if (this.removeDate) {
    return this.removeDate < new Date();
  }
  return this.deadline && this.deadline < new Date();
});

// Method to increment views
jobSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
