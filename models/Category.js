import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  brands: [{ type: String }], // Optional: only some subcategories will have brands
  customFields: [{ type: String }] // Optional: fields unique to this subcategory
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  subcategories: [subcategorySchema] // Embedded subcategories
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
