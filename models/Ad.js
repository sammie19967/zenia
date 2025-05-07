const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    customFields: { type: Schema.Types.Mixed, default: {} },
    location: {
      county: { type: String, required: true },
      subcounty: { type: String, required: true },
      town: { type: String, required: true },
    },
    brand: { type: String },
    images: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: "User",  },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      whatsapp: { type: String },
    },
    status: {
      type: String,
      enum: ["active", "pending", "sold", "inactive"],
      default: "pending",
    },
    views: { type: Number, default: 0 }, // Tracks the number of views for the ad
    paymentPlan: {
      type: String,
      enum: ["Free Ad", "Premium Ad", "Featured Ad"],
      default: "Free Ad", // Specifies the payment plan for the ad
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Ad || mongoose.model("Ad", AdSchema);