import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    media: {
      images: {
        type: [String],
        validate: {
          validator: function (v) {
            return v.length <= 4;
          },
          message: "You can upload up to 4 images.",
        },
      },
      video: {
        type: String,
        trim: true,
      },
      links: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
      enum: [
        "Programming & Tech",
        "Design & Creative",
        "Music & Arts",
        "Language Learning",
        "Business & Marketing",
        "Cooking & Culinary",
        "Fitness & Sports",
        "Photography & Video",
        "Writing & Content",
        "Crafts & DIY",
        "Other",
      ],
    },
    modesAvailable: [
      {
        type: String,
        enum: ["paid", "hybrid", "barter"],
        required: true,
      },
    ],
    deliveryOptions: [
      {
        type: String,
        enum: ["online", "in-person"],
        default: ["online"],
      },
    ],
    location: {
      city: String,
      country: String,
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },
    requirements: {
      type: String,
      maxlength: [1000, "Requirements cannot exceed 1000 characters"],
    },
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all-levels"],
      default: "all-levels",
    },
    availability: {
      schedule: [
        {
          day: {
            type: String,
            enum: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ],
          },
          timeSlots: [
            {
              startTime: String,
              endTime: String,
            },
          ],
        },
      ],
      timezone: {
        type: String,
        default: "UTC",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    paidPrice: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
      unit: { type: String, default: "hour" },
    },
    creditsPerUnit: {
      type: Number,
      default: 0,
    },
    stats: {
      totalBookings: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
    },
    tags: [String],
    exchangeMode: {
      type: String,
      enum: ["paid", "barter", "hybrid"],
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ userId: 1, createdAt: -1 });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ tags: 1 });
serviceSchema.index({ exchangeMode: 1 });
serviceSchema.index({ "location.coordinates": "2dsphere" });

serviceSchema.pre("save", async function () {
  if (this.isNew) {
    const User = mongoose.model("User");
    const user = await User.findById(this.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is free tier
    const isFreeUser = user.accountType === "free";

    if (isFreeUser) {
      // Count active services for this user
      const Service = mongoose.model("Service");
      const activeServiceCount = await Service.countDocuments({
        userId: this.userId,
        isActive: true,
      });

      if (activeServiceCount >= 4) {
        throw new Error(
          "Free users can only create up to 4 active services. Please upgrade to premium or deactivate an existing service."
        );
      }
    }
  }
});

serviceSchema.virtual("pricingDisplay").get(function () {
  if (!this.modesAvailable || this.modesAvailable.length === 0) {
    return "No modes available";
  }

  const displays = [];
  const unit = this.paidPrice?.unit || "unit";
  const currency = this.paidPrice?.currency || "USD";
  const amount = this.paidPrice?.amount || 0;
  const credits = this.creditsPerUnit || 0;

  if (this.modesAvailable.includes("barter")) {
    displays.push(`${credits} credit${credits > 1 ? "s" : ""}/${unit}`);
  }

  if (this.modesAvailable.includes("paid")) {
    displays.push(`${currency} ${amount}/${unit}`);
  }

  if (this.modesAvailable.includes("hybrid")) {
    displays.push(
      `${currency} ${amount / 2} + ${credits} credit${
        credits > 1 ? "s" : ""
      }/${unit}`
    );
  }

  return displays.join(" | ");
});

// Method to check if service can be booked
serviceSchema.methods.canBeBooked = function () {
  return this.isActive && !this.isDeleted;
};

// Method to increment booking count
serviceSchema.methods.incrementBooking = async function () {
  this.stats.totalBookings += 1;
  await this.save();
};

// Static method to get user's active service count
serviceSchema.statics.getUserActiveServiceCount = async function (userId) {
  return await this.countDocuments({
    userId,
    isActive: true,
  });
};

// Static method to check if user can create more services
serviceSchema.statics.canUserCreateService = async function (userId) {
  const User = mongoose.model("User");
  const user = await User.findById(userId);

  if (!user) {
    return { canCreate: false, reason: "User not found" };
  }

  const isFreeUser = user.accountType === "free";

  if (isFreeUser) {
    const activeCount = await this.getUserActiveServiceCount(userId);
    if (activeCount >= 4) {
      return {
        canCreate: false,
        reason:
          "Free users can only have 4 active services. Upgrade to premium or deactivate a service.",
        currentCount: activeCount,
        limit: 4,
      };
    }
  }

  return { canCreate: true };
};

serviceSchema.set("toJSON", { virtuals: true });
serviceSchema.set("toObject", { virtuals: true });

const Service = mongoose.model("Service", serviceSchema);

export default Service;
