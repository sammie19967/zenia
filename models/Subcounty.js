import mongoose from 'mongoose';

const subcountySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  countyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'County',
    required: true,
  },
});

export default mongoose.models.Subcounty || mongoose.model('Subcounty', subcountySchema);
