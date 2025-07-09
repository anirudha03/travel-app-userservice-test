import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user });

  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};

export const updateUserProfile = async (req, res) => {
  const { id } = req.user;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updates, {
      new: false,
      runValidators: true
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

export const checkUsername = async (req, res) => {
  const { username } = req.query;

  if (!username) return res.status(400).json({ message: "Username required" });

  try {
    const user = await User.findOne({ username }).lean();
    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const generateOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 20 * 60 * 1000); 

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    await axios.post('https://travel-app-emailservice.vercel.app/send-otp', {
      email,
      otp
    });

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ message: "Error generating OTP", error });
  }
};

export const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword, email, otp } = req.body;

  try {
    if (id && oldPassword && newPassword) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

      user.password = await bcrypt.hash(newPassword, 10);
      user.tokenInvalidBefore = new Date(); 

      await user.save();

      return res.status(200).json({ message: 'Password updated successfully using old password' });
    }
    if (email && otp && newPassword) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const currentTime = new Date();
      if (!user.otp || user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      if (user.otpExpiry < currentTime) {
        return res.status(400).json({ message: 'OTP has expired' });
      }

      // All good, update password and invalidate token
      user.password = await bcrypt.hash(newPassword, 10);
      user.otp = null;
      user.otpExpiry = null;
      user.tokenInvalidBefore = new Date(); // 🔒 Invalidate previous tokens

      await user.save();

      return res.status(200).json({ message: 'Password reset successfully using OTP' });
    }
    return res.status(400).json({
      message:
        'Invalid request. Provide either (id, oldPassword, newPassword) or (email, otp, newPassword)',
    });

  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ message: 'Server error while changing password', error: err.message });
  }
};
