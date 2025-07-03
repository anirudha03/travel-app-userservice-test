import Preference from '../models/preferences.model.js';

export const createPreference = async (req, res) => {
  const { name } = req.body;
  const imageUrl = req.file?.path;

  if (!name || !imageUrl) {
    return res.status(400).json({ message: "Name and image are required." });
  }

  try {
    const newPreference = new Preference({ name, imageUrl });
    await newPreference.save();
    res.status(201).json({ message: "Preference created", preference: newPreference });
  } catch (err) {
    res.status(500).json({ message: "Error creating preference", error: err.message });
  }
};

export const getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find(); // fetch all from MongoDB
    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch preferences", error });
  }
};