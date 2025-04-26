import mongoose from "mongoose";

// Ad Schema
const adSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to the Category model
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory", // Reference to Subcategory, if needed, or you can use a plain string
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model, assuming logged-in user details are stored here
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  customFields: {
    // This will store custom fields based on subcategory
    type: Map,
    of: String, // The keys will be field names and values will be the field values (like storage capacity, color, etc.)
    required: true,
  },
  images: [
    {
      type: String, // URL for the images
      required: true,
    },
  ],
  video: {
    type: String, // URL for the video (if available)
    default: null,
  },
  views: {
    type: Number,
    default: 0, // Track the number of views the ad has
  },
  location: {
    county: {
      type: String,
      required: true, // Assuming location is based on counties and subcounties
    },
    subcounty: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ad = mongoose.models.Ad || mongoose.model("Ad", adSchema);

export default Ad;
