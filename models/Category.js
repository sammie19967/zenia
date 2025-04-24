import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  subcategories: { type: [SubcategorySchema], default: [] },
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
