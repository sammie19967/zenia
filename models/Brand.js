import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
