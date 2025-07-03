import express from 'express';
import upload from '../middleware/cloudinaryUploader.js';
import { createPreference, getAllPreferences } from '../controllers/preferences.controller.js';

const router = express.Router();

router.post('/create', upload.single('image'), createPreference);
router.get('/all', getAllPreferences);

export default router;