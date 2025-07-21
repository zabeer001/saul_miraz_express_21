import { updateCloudinaryImage } from './cloudinary.js';

export const updateSingleImage = async (imageFile, oldImageUrl) => {
  if (!imageFile || !imageFile.buffer) return oldImageUrl;

  const base64 = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
  const uploadRes = await updateCloudinaryImage(base64, oldImageUrl);
  return uploadRes.secure_url;
};