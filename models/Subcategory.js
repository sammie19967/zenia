import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
  name: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

export default mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
