import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Preference', preferenceSchema);