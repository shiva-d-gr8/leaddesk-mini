const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    projectType: {
      type: String,
      required: true,
      enum: [
        "Website",
        "Web Application",
        "SaaS Product",
        "AI Application",
        "Mobile Application",
        "Custom Software",
      ],
    },

    budgetRange: {
      type: String,
      required: true,
      enum: [
        "Under ₹50,000",
        "₹50,000 - ₹2,00,000",
        "₹2,00,000 - ₹5,00,000",
        "Above ₹5,00,000",
      ],
    },

    timeline: {
      type: String,
      required: true,
      enum: [
  "Immediately",
  "Within 1 month",
  "1-3 months",
  "3+ months",
  "Just exploring",
],
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
      index: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      index: true,
    },

    leadScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      index: true,
    },

    projectBrief: {
      summary: {
        type: String,
      },

      recommendedServices: {
        type: [String],
      },

      estimatedComplexity: {
        type: String,
        enum: ["Low", "Medium", "High"],
      },
    },

    adminNotes: [
      {
        text: {
          type: String,
          maxlength: 1000,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);