import { uploadToCloudinary } from "./cloudinary.js";


/**
 * Uploads multiple media files to Cloudinary and normalizes them.
 * 
 * @param {Array} files - Array of file objects (e.g., files['media']).
 * @param {string} folder - The Cloudinary folder name (default: 'products').
 * @returns {Promise<Array>} - Array of objects with file_path, alt, and order.
 */
export const uploadMultipleMedia = async (files, folder = 'products') => {
  if (!Array.isArray(files)) return [];

  const uploads = await Promise.all(
    files.map(async (file, index) => {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const uploadRes = await uploadToCloudinary(base64, folder);
      return {
        file_path: uploadRes.secure_url,
        alt: file.originalname || '',
        order: index,
      };
    })
  );

  return uploads;
};
