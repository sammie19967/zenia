import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  brands: [{ type: String }],
  customFields: { type: Object } // Now correctly set as an object
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  subcategories: [subcategorySchema]
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
