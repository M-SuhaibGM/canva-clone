// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.cloud_name,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.api_key,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.api_secret,
});

export const uploadMediaToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};

// ✅ Assign object to a variable first
const cloudinaryUtils = { uploadMediaToCloudinary };

export default cloudinaryUtils;
