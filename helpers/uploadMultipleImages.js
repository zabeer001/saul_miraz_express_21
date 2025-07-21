import { uploadToCloudinary } from "./cloudinary.js";


/**
 * Uploads multiple image files to Cloudinary.
 * 
 * @param {Array} files - Array of file objects with buffer and mimetype
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<Array>} - Array of uploaded image objects
 */
export const uploadMultipleImages = async (files = [], folder = 'products') => {
  const uploadedImages = [];

  for (const file of files) {
    if (file?.buffer) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const uploadRes = await uploadToCloudinary(base64, folder);

      uploadedImages.push({
        url: uploadRes.secure_url,
        alt: '',
        order: 0,
      });
    }
  }

  return uploadedImages;
};
