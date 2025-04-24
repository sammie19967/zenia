import mongoose from 'mongoose';
const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  icon: { type: String },
  image: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
