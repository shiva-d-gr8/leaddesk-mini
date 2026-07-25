const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "ENQUIRY_CREATED",
        "STATUS_CHANGED",
        "NOTE_ADDED",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    previousStatus: {
      type: String,
    },

    newStatus: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);