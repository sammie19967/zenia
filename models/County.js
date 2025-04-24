import mongoose from 'mongoose';

const TownSchema = new mongoose.Schema({
  type: String
}, { _id: false });

const SubcountySchema = new mongoose.Schema({
  name: String,
  towns: [String],
}, { _id: false });

const CountySchema = new mongoose.Schema({
  id: Number, // This is your custom numeric ID
  name: String,
  subcounties: [SubcountySchema],
});

export default mongoose.models.County || mongoose.model('County', CountySchema);
