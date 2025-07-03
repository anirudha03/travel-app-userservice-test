import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travel-preferences',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 360, height: 240, crop: 'limit' }],
  },
});

const upload = multer({ storage });

export default upload;
