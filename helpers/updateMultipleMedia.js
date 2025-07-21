import { updateMultipleImages } from "./updateMultipleImages.js";


export const updateMultipleMedia = async (mediaFiles, productMedia) => {
  if (!mediaFiles) return productMedia || [];

  // Get old image URLs from product media
  const oldImageUrls = (productMedia || []).map(m => m.file_path);

  // Update images using the existing helper
  let updatedMedia = await updateMultipleImages(mediaFiles, oldImageUrls);

  // Ensure all media objects have required fields
  updatedMedia = updatedMedia.map((media, idx) => ({
    file_path: media.file_path || media.url || '',
    alt: media.alt || '',
    order: typeof media.order === 'number' ? media.order : idx,
  }));

  return updatedMedia;
};