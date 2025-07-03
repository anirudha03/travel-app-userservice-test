import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import preferenceRoutes from './routes/preferences.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/preferences', preferenceRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.user_connection);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ DB Connection Failed", err);
    process.exit(1);
  }
};

startServer();
