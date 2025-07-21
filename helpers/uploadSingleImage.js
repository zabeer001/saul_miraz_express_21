import { uploadToCloudinary } from "./cloudinary.js";


/**
 * Uploads a single image file to Cloudinary from a `files` object.
 * 
 * @param {Object} files - The `req.files` object.
 * @param {string} fieldName - The name of the field (e.g., 'image').
 * @returns {Promise<string|null>} - The secure URL of the uploaded image or null if not available.
 */
export const uploadSingleImage = async (files, fieldName = 'image') => {
  if (files?.[fieldName]?.[0]?.buffer) {
    const image = files[fieldName][0];
    const base64 = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
    const uploadRes = await uploadToCloudinary(base64);
    return uploadRes.secure_url;
  }
  return null;
};
