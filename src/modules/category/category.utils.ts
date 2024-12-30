import { CloudinaryStorage } from '@fluidjs/multer-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import envConfig from '../../config/env.config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_INFO.cloudinary_cloud_name,
  api_key: envConfig.CLOUDINARY_INFO.cloudinary_api_key,
  api_secret: envConfig.CLOUDINARY_INFO.cloudinary_api_secret,
});

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Category', // Optional: Folder for uploaded files in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Optional: Restrict allowed file types
    transformation: [{ width: 400, height: 400, crop: 'limit' }], // Optional: Apply image transformations on upload
  },
});

const CategoryImageUpload = multer({ storage: storage });

export default CategoryImageUpload;
