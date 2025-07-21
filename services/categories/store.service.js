import Category from '../../models/category.model.js';
import { uploadSingleImage } from '../../helpers/uploadSingleImage.js'; // Adjust path if needed

export const storeService = async ({ name, description, files ,type }) => {

  console.log(files);
  
  const existing = await Category.findOne({ name });
  if (existing) {
    throw new Error('Category name already exists');
  }

  // Upload image (if available)
  const imageUrl = await uploadSingleImage(files, 'image');

  const category = await Category.create({
    name,
    description,
    image: imageUrl, // Add uploaded image URL to the DB
    type
  });

  return category;
};
