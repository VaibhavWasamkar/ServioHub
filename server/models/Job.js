const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    address: String,
    pincode: String,
    city: String,
    status: {
      type: String,
      enum: ["open", "assigned", "done"],
      default: "open"
    },

    // Support both Customer and Technician models
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "postedByModel"
    },
    postedByModel: {
      type: String,
      required: true,
      enum: ["Customer", "Technician"] // your actual model names
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assignedToModel"
    },
    assignedToModel: {
      type: String,
      enum: ["Technician"]
    },
    assignedTechnicianPhone: {
      type: String
    },
    review: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
