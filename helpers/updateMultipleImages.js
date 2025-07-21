import { deleteFromCloudinary, uploadToCloudinary } from "./cloudinary.js";



/**
 * Updates multiple images: deletes old ones and uploads new ones.
 * 
 * @param {Array} newFiles - New image file objects with buffer and mimetype
 * @param {Array} oldImageUrls - Array of existing image URLs (to delete)
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<Array>} - Array of new uploaded image objects
 */
export const updateMultipleImages = async (newFiles = [], oldImageUrls = [], folder = 'products') => {
  // Delete old images
  for (const oldUrl of oldImageUrls) {
    if (oldUrl) {
      const segments = oldUrl.split('/');
      const lastSegment = segments.pop(); // e.g. "abc123.jpg"
      const publicId = `${folder}/${lastSegment.split('.')[0]}`;
      await deleteFromCloudinary(publicId);
    }
  }

  // Upload new images as media objects
  const uploadedMedia = [];

  for (const file of newFiles) {
    if (file?.buffer) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const uploadRes = await uploadToCloudinary(base64, folder);
      uploadedMedia.push({
        file_path: uploadRes.secure_url,
        alt: '',
        order: 0,
      });
    }
  }

  return uploadedMedia;
};
