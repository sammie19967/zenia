import mongoose from 'mongoose';

// Town schema should be an array of strings, not an embedded document
const TownSchema = new mongoose.Schema({
  name: { type: String, required: true }
}, { _id: false });

const SubcountySchema = new mongoose.Schema({
  name: { type: String, required: true },
  towns: { type: [String], default: [] } // Make towns an array of strings
}, { _id: false });

const CountySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  subcounties: { type: [SubcountySchema], default: [] }
});

export default mongoose.models.County || mongoose.model('County', CountySchema);
