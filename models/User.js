//models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true, // ensures one Firebase user per entry
    },
    email: {
      type: String,
      required: false, // optional for phone-based users
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: false, // optional for email or Google auth
    },
    name: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    provider: {
      type: String, // 'google.com', 'phone', etc.
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
