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
  totalTrips: { type: Number, default: 0 },
  profilePicUrl: { type: String, default: '' },
  preferences: [{ type: String }],
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  Token: { type: String },
  tokenInvalidBefore: { type: Date, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastLogin: { type: Date },
  reports: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);