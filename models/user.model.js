import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phoneNumber: { type: String },
  birthday: { type: Date },
  bio: { type: String, default: '' },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  totalPosts: { type: Number, default: 0 },
  profilePicUrl: { type: String, default: '' },
  preferences: [{ type: String }],
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastLogin: { type: Date },
  reports: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);