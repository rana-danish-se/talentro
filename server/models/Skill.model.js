import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "Technical Skills",
        "Programming & Software Development",
        "Data & Analytics",
        "AI & Machine Learning",
        "Cloud & DevOps",
        "Cybersecurity",
        "IT & Networking",
        "Engineering & Architecture",
        "Business & Management",
        "Marketing & Advertising",
        "Sales & Customer Success",
        "Finance & Accounting",
        "Human Resources",
        "Design & Creative",
        "Art & Illustration",
        "Writing & Content Creation",
        "Media & Communication",
        "Interpersonal & Soft Skills",
        "Leadership & Management",
        "Education & Teaching",
        "Legal & Compliance",
        "Healthcare & Medicine",
        "Science & Research",
        "Languages",
        "Manufacturing & Production",
        "Skilled Trades (Technical Labor)",
        "Operations & Supply Chain",
        "Hospitality & Tourism",
        "Sports & Fitness",
        "Music & Performing Arts",
        "Personal Development",
        "Lifestyle & Hobbies",
        "Others",
      ],
      required: true,
      index: true,
    },
    usage: {
      education: {
        name: {
          type: String,
        },
      },
      work: {
        name: {
          type: String,
        },
      },
      project: {
        name: {
          type: String,
        },
      },
      other: {
        name: {
          type: String,
        },
      },
    },
    endorsements: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    proficiencyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
skillSchema.index({ userId: 1, type: 1 });
skillSchema.index({ name: 1 });
skillSchema.index({ category: 1 });

export const Skill = mongoose.model("Skill", skillSchema);
