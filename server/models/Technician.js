const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  expertise: { type: String, required: true },
  experience: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  role: { type: String, default: "technician" },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  totalRatings: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Technician", technicianSchema);
