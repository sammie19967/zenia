import mongoose from 'mongoose';

const countySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.models.County || mongoose.model('County', countySchema);
