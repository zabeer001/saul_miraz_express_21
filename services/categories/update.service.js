import Category from '../../models/category.model.js';
import { updateSingleImage } from '../../helpers/updateSingleImage.js';



export const updateService = async ({ id, name, description, files, type }) => {
  const category = await Category.findById(id);
  if (!category) throw new Error('Category not found');

  const existing = await Category.findOne({ name, _id: { $ne: id } });
  if (existing) throw new Error('Category name already exists');

  // Handle the image array properly
  const imageFile = files?.image?.[0]; // Get first image from array
  const imageUrl = imageFile 
    ? await updateSingleImage(imageFile, category.image) 
    : category.image;

  category.name = name;
  category.description = description;
  category.image = imageUrl;
  category.type = type;

  await category.save();

  return category;
};