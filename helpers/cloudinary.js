import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_URL } from '../config/env.js';

cloudinary.config({
  cloudinary_url: CLOUDINARY_URL,
  secure: true,
});

/**
 * Uploads a file to Cloudinary.
 * 
 * @param {string} filePath - Path or base64 string.
 * @param {string} folder - Optional folder.
 * @returns {Promise<Object>} - Cloudinary upload result.
 */
export const uploadToCloudinary = async (filePath, folder = 'products') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Deletes a file from Cloudinary using its public ID.
 * 
 * @param {string} publicId - Cloudinary public ID.
 * @returns {Promise<Object>} - Cloudinary deletion result.
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

/**
 * Updates an image in Cloudinary: deletes the old one and uploads a new one.
 * 
 * @param {string} newFilePath - Path or base64 string for the new image.
 * @param {string|null} oldImageUrl - The full URL of the previous Cloudinary image.
 * @param {string} folder - Optional folder.
 * @returns {Promise<Object>} - Cloudinary upload result of the new image.
 */
export const updateCloudinaryImage = async (newFilePath, oldImageUrl = null, folder = 'products') => {
  try {
    // Extract public_id from the old image URL
    if (oldImageUrl) {
      const segments = oldImageUrl.split('/');
      const lastSegment = segments.pop(); // e.g. "abc123.jpg"
      const publicId = `${folder}/${lastSegment.split('.')[0]}`;
      await deleteFromCloudinary(publicId);
    }

    // Upload new image
    const result = await uploadToCloudinary(newFilePath, folder);
    return result;
  } catch (error) {
    console.error('Cloudinary image update error:', error);
    throw new Error('Failed to update image in Cloudinary');
  }
};
