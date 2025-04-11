import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  condition: String,
  negotiable: String,
  sellerName: String,
  phoneNumber: String,
  email: String,
  categoryId: mongoose.Schema.Types.ObjectId,
  subcategoryId: mongoose.Schema.Types.ObjectId,
  brandId: mongoose.Schema.Types.ObjectId,
  countyId: mongoose.Schema.Types.ObjectId,
  subcountyId: mongoose.Schema.Types.ObjectId,
  images: [String], // URLs or filenames

  package: String,
}, { timestamps: true });

export default mongoose.models.Ad || mongoose.model('Ad', adSchema);
