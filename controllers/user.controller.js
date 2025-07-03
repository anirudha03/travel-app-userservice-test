import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// USER DETAILS UPDATE AND HOW DOES BACKEND KNOW WHCH USER IS REQUESTING UPDATE AND HOW TOKEN IS BEING VERIFIED
// ADD BACK BUTTON IN PREFERENCES SECTION